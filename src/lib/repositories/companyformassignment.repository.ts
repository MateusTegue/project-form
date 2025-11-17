import { AppDataSource } from '../database/data-source'
import { CompanyFormAssignment } from '../database/entities/companyformassignment'
import { Company } from '../database/entities/company'
import { FormTemplate } from '../database/entities/formtemplate'
import { ConflictError, NotFoundError } from '../helpers/exceptions-errors'
import { StatusEnum } from '../enums/EnumEntity'
import { randomUUID } from 'crypto'

interface AssignFormInput {
  companyId: string
  formTemplateId: string
  allowMultipleSubmissions?: boolean
  allowEditAfterSubmit?: boolean
  expiresAt?: Date
  customConfig?: any
}

export const CompanyFormAssignmentRepository = AppDataSource.getRepository(CompanyFormAssignment).extend({
  async assignFormToCompany(data: AssignFormInput): Promise<CompanyFormAssignment> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const company = await queryRunner.manager.findOne(Company, {
        where: { id: data.companyId, status: StatusEnum.ACTIVE }
      })

      if (!company) {
        throw new NotFoundError(`Company with id ${data.companyId} not found`)
      }

      const formTemplate = await queryRunner.manager.findOne(FormTemplate, {
        where: { id: data.formTemplateId, status: StatusEnum.ACTIVE }
      })

      if (!formTemplate) {
        throw new NotFoundError(`Form template with id ${data.formTemplateId} not found`)
      }

      const existingAssignment = await queryRunner.manager.findOne(CompanyFormAssignment, {
        where: {
          company: { id: data.companyId },
          formTemplate: { id: data.formTemplateId },
          status: StatusEnum.ACTIVE
        }
      })

      if (existingAssignment) {
        throw new ConflictError(
          `Form template is already assigned to this company. Assignment ID: ${existingAssignment.id}`
        )
      }

      const publicToken = randomUUID()
      const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/form/${publicToken}`

      const assignment = queryRunner.manager.create(CompanyFormAssignment, {
        company,
        formTemplate,
        publicToken,
        publicUrl,
        isActive: true,
        allowMultipleSubmissions: data.allowMultipleSubmissions ?? false,
        allowEditAfterSubmit: data.allowEditAfterSubmit ?? false,
        activatedAt: new Date(),
        expiresAt: data.expiresAt,
        customConfig: data.customConfig,
        status: StatusEnum.ACTIVE
      })

      const savedAssignment = await queryRunner.manager.save(CompanyFormAssignment, assignment)

      await queryRunner.commitTransaction()

      return await this.findOne({
        where: { id: savedAssignment.id },
        relations: {
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
        }
      }) as CompanyFormAssignment
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },

  async getByPublicToken(token: string): Promise<CompanyFormAssignment | null> {
    const assignment = await this.findOne({
      where: {
        publicToken: token,
        isActive: true,
        status: StatusEnum.ACTIVE
      },
      relations: {
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
      order: {
        formTemplate: {
          moduleAssignments: {
            displayOrder: 'ASC',
            module: {
              fields: {
                displayOrder: 'ASC',
                options: {
                  displayOrder: 'ASC'
                }
              }
            }
          }
        }
      }
    })

    if (!assignment) {
      return null
    }

    // Asegurar que las opciones se filtren y ordenen correctamente
    if (assignment.formTemplate?.moduleAssignments) {
      for (const moduleAssignment of assignment.formTemplate.moduleAssignments) {
        if (moduleAssignment.module?.fields) {
          for (const field of moduleAssignment.module.fields) {
            if (field.options && Array.isArray(field.options)) {
              // Filtrar opciones activas y ordenar
              field.options = field.options
                .filter((opt: any) => opt.isActive !== false)
                .sort((a: any, b: any) => {
                  const orderA = a.displayOrder ?? 0
                  const orderB = b.displayOrder ?? 0
                  return orderA - orderB
                })
            }
          }
        }
      }
    }

    return assignment
  },

  getAssignedTemplatesByCompanyId: async function (companyId: string): Promise<CompanyFormAssignment[]> {
    const assignments = await this.find({
      where: {
        company: { id: companyId },
        isActive: true,
        status: StatusEnum.ACTIVE
      },
      relations: {
        formTemplate: {
          createdBy: true,
          moduleAssignments: {
            module: {
              fields: {
                options: true
              }
            }
          }
        }
      },
      order: {
        created_at: 'DESC',
        formTemplate: {
          moduleAssignments: {
            displayOrder: 'ASC',
            module: {
              fields: {
                displayOrder: 'ASC',
                options: {
                  displayOrder: 'ASC'
                }
              }
            }
          }
        }
      }
    })

    return assignments
  },

  getCompanyAssignments: async function (companyId: string): Promise<CompanyFormAssignment[]> {
    return await this.find({
      where: {
        company: { id: companyId },
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
        },
      },
      order: {
        created_at: 'DESC'
      }
    })
  },

  async deactivateAssignment(assignmentId: string): Promise<CompanyFormAssignment> {
    const assignment = await this.findOne({ where: { id: assignmentId } })

    if (!assignment) {
      throw new NotFoundError(`Assignment with id ${assignmentId} not found`)
    }

    if (!assignment.isActive || assignment.status === StatusEnum.INACTIVE) {
      throw new Error(`Assignment ${assignmentId} is already inactive`)
    }

    assignment.isActive = false
    assignment.status = StatusEnum.INACTIVE

    return await this.save(assignment)
  },
})

