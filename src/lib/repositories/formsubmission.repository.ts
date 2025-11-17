import { AppDataSource } from '../database/data-source'
import { FormSubmission } from '../database/entities/formsubmission'
import { SubmissionAnswer } from '../database/entities/submissionanswer'
import { CompanyFormAssignment } from '../database/entities/companyformassignment'
import { NotFoundError } from '../helpers/exceptions-errors'
import { StatusEnum, SubmissionStatusEnum } from '../enums/EnumEntity'

interface CreateSubmissionInput {
  publicToken: string
  submitterEmail?: string
  submitterName?: string
  submitterPhone?: string
  submitterDocumentId?: string
  ipAddress?: string
  userAgent?: string
  answers: Record<string, any>
}

interface GetSubmissionsFilters {
  companyId: string
  status?: SubmissionStatusEnum
  search?: string
}

export const FormSubmissionRepository = AppDataSource.getRepository(FormSubmission).extend({
  async createSubmission(data: CreateSubmissionInput): Promise<FormSubmission> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const assignment = await queryRunner.manager.findOne(CompanyFormAssignment, {
        where: {
          publicToken: data.publicToken,
          isActive: true,
          status: StatusEnum.ACTIVE
        },
        relations: {
          formTemplate: {
            moduleAssignments: {
              module: {
                fields: {
                  options: true
                }
              }
            }
          }
        }
      })

      if (!assignment) {
        throw new NotFoundError('Form assignment not found or inactive')
      }

      if (assignment.expiresAt && new Date(assignment.expiresAt) < new Date()) {
        throw new Error('Form has expired')
      }

      const hasAnswers = Object.keys(data.answers || {}).some(key => {
        const value = data.answers[key]
        return value !== undefined && value !== null && value !== '' && 
               !(Array.isArray(value) && value.length === 0)
      })

      if (!hasAnswers) {
        throw new Error('El formulario no puede enviarse vacío. Por favor complete al menos un campo.')
      }

      const submission = queryRunner.manager.create(FormSubmission, {
        companyFormAssignment: assignment,
        submitterEmail: data.submitterEmail,
        submitterName: data.submitterName,
        submitterPhone: data.submitterPhone,
        submitterDocumentId: data.submitterDocumentId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        submittedAt: new Date(),
        status: SubmissionStatusEnum.EARRING
      })

      const savedSubmission = await queryRunner.manager.save(FormSubmission, submission)

      const answers: SubmissionAnswer[] = []

      // Verificar que las relaciones estén cargadas
      if (!assignment.formTemplate || !assignment.formTemplate.moduleAssignments) {
        throw new Error('Form template or module assignments not loaded')
      }

      for (const moduleAssignment of assignment.formTemplate.moduleAssignments) {
        if (!moduleAssignment.module || !moduleAssignment.module.fields) {
          console.warn(`Module assignment ${moduleAssignment.id} does not have module or fields loaded`)
          continue
        }

        for (const field of moduleAssignment.module.fields) {
          if (!field.fieldKey) {
            console.warn(`Field ${field.id} does not have fieldKey`)
            continue
          }

          const value = data.answers[field.fieldKey]

          if (value !== undefined && value !== null && value !== '') {
            const answer = queryRunner.manager.create(SubmissionAnswer, {
              submission: savedSubmission,
              field: field,
              fieldKey: field.fieldKey,
              textValue: String(value),
            })

            answers.push(answer)
          }
        }
      }

      if (answers.length > 0) {
        await queryRunner.manager.save(SubmissionAnswer, answers)
      }

      await queryRunner.commitTransaction()

      return await this.findOne({
        where: { id: savedSubmission.id },
        relations: {
          companyFormAssignment: {
            company: true,
            formTemplate: true
          },
          answers: {
            field: true
          }
        }
      }) as FormSubmission
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },

  async getSubmissionsByCompany(filters: GetSubmissionsFilters): Promise<FormSubmission[]> {
    const queryBuilder = this.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.companyFormAssignment', 'assignment')
      .leftJoinAndSelect('assignment.company', 'company')
      .leftJoinAndSelect('assignment.formTemplate', 'template')
      .leftJoinAndSelect('submission.answers', 'answers')
      .leftJoinAndSelect('answers.field', 'field')
      .leftJoinAndSelect('field.module', 'module')
      .where('company.id = :companyId', { companyId: filters.companyId })

    if (filters.status) {
      queryBuilder.andWhere('submission.status = :status', { status: filters.status })
    } else {
      queryBuilder.andWhere('submission.status != :deletedStatus', { deletedStatus: SubmissionStatusEnum.DELETED })
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(submission.submitterName ILIKE :search OR submission.submitterEmail ILIKE :search OR submission.submitterDocumentId ILIKE :search OR EXISTS (SELECT 1 FROM submission_answer sa WHERE sa."formSubmissionId" = submission.id AND sa."textValue" ILIKE :search))',
        { search: `%${filters.search}%` }
      )
    }

    queryBuilder.orderBy('submission.submittedAt', 'DESC')

    return await queryBuilder.getMany()
  },

  async getSubmissionById(submissionId: string): Promise<FormSubmission | null> {
    const submission = await this.findOne({
      where: { id: submissionId },
      relations: {
        companyFormAssignment: {
          company: true,
          formTemplate: {
            moduleAssignments: {
              module: {
                fields: {
                  options: true
                }
              }
            }
          }
        },
        answers: {
          field: {
            module: true,
            options: true
          }
        }
      }
    })

    if (submission && submission.answers) {
      submission.answers.sort((a, b) => {
        const orderA = a.field?.displayOrder || 0
        const orderB = b.field?.displayOrder || 0
        return orderA - orderB
      })
    }

    return submission
  },

  async updateSubmissionStatus(
    submissionId: string,
    status: SubmissionStatusEnum,
    reviewedBy?: string
  ): Promise<FormSubmission | null> {
    const submission = await this.findOne({
      where: { id: submissionId }
    })

    if (!submission) {
      return null
    }

    submission.status = status
    submission.reviewedBy = reviewedBy
    submission.reviewedAt = new Date()

    return await this.save(submission)
  },

  async countPendingByCompany(companyId: string): Promise<number> {
    return await this.createQueryBuilder('submission')
      .leftJoin('submission.companyFormAssignment', 'assignment')
      .leftJoin('assignment.company', 'company')
      .leftJoin('company.role', 'role')
      .where('company.id = :companyId', { companyId })
      .andWhere('submission.status = :status', { status: SubmissionStatusEnum.EARRING })
      .andWhere('role.name = :roleName', { roleName: 'COMPANY' })
      .getCount()
  },

  async getSubmissionStatsByCompany(companyId: string): Promise<{
    total: number
    pendiente: number
    procesando: number
    procesado: number
  }> {
    const total = await this.createQueryBuilder('submission')
      .leftJoin('submission.companyFormAssignment', 'assignment')
      .leftJoin('assignment.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getCount()

    const pendiente = await this.createQueryBuilder('submission')
      .leftJoin('submission.companyFormAssignment', 'assignment')
      .leftJoin('assignment.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere('submission.status = :status', { status: SubmissionStatusEnum.EARRING })
      .getCount()

    const procesando = await this.createQueryBuilder('submission')
      .leftJoin('submission.companyFormAssignment', 'assignment')
      .leftJoin('assignment.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere('submission.status = :status', { status: SubmissionStatusEnum.PROGRESS })
      .getCount()

    const procesado = await this.createQueryBuilder('submission')
      .leftJoin('submission.companyFormAssignment', 'assignment')
      .leftJoin('assignment.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere('submission.status = :status', { status: SubmissionStatusEnum.PROCESSED })
      .getCount()

    return {
      total,
      pendiente,
      procesando,
      procesado,
    }
  },

  async deleteSubmissionById(id: string, reviewedBy?: string): Promise<FormSubmission> {
    const submission = await this.findOne({
      where: { id }
    })

    if (!submission) {
      throw new NotFoundError(`Submission con id ${id} no encontrada`)
    }

    const currentStatus = submission.status as string
    if (currentStatus === SubmissionStatusEnum.DELETED || currentStatus === 'ELIMINADO') {
      throw new NotFoundError(`La submission con id ${id} ya está eliminada`)
    }

    submission.status = SubmissionStatusEnum.DELETED
    submission.reviewedAt = new Date()
    if (reviewedBy) {
      submission.reviewedBy = reviewedBy
    }

    return await this.save(submission)
  },
})

