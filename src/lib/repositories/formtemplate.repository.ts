import { AppDataSource } from '../database/data-source'
import { FormTemplate } from '../database/entities/formtemplate'
import { FormTemplateModule } from '../database/entities/formTemplateModule'
import { FormModule } from '../database/entities/formodule'
import { NotFoundError, ConflictError, ServerError } from '../helpers/exceptions-errors'
import { StatusEnum } from '../enums/EnumEntity'

interface CreateTemplateWithModulesInput {
  name: string
  description?: string
  templateType: string
  createdBy: string
  modules: {
    moduleId: string
    displayOrder: number
    isRequired: boolean
    isActive: boolean
  }[]
}

export const FormTemplateRepository = AppDataSource.getRepository(FormTemplate).extend({
  getAllFormTemplatesWithModules: async function (): Promise<FormTemplate[]> {
    const templates = await this.find({
      where: { status: StatusEnum.ACTIVE },
      relations: {
        createdBy: true,
        moduleAssignments: {
          module: {
            fields: {
              options: true
            }
          }
        }
      },
      order: {
        created_at: 'DESC',
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
    })

    if (templates.length === 0) {
      throw new NotFoundError('No form templates found')
    }

    return templates
  },

  async createTemplateWithModules(data: CreateTemplateWithModulesInput): Promise<FormTemplate> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const existingTemplate = await queryRunner.manager.findOne(FormTemplate, {
        where: { name: data.name }
      })

      if (existingTemplate) {
        throw new ConflictError(
          `Ya existe una plantilla con el nombre "${data.name}"`,
          { name: data.name }
        )
      }

      const template = queryRunner.manager.create(FormTemplate, {
        name: data.name,
        description: data.description,
        templateType: data.templateType as any,
        status: StatusEnum.ACTIVE,
        createdBy: { id: data.createdBy }
      })

      const savedTemplate = await queryRunner.manager.save(FormTemplate, template)

      if (data.modules && data.modules.length > 0) {
        for (const moduleData of data.modules) {
          const existingModule = await queryRunner.manager.findOne(FormModule, {
            where: { id: moduleData.moduleId, isActive: true }
          })

          if (!existingModule) {
            throw new NotFoundError(
              `No se encontró el módulo con ID: ${moduleData.moduleId}`
            )
          }

          const templateModule = queryRunner.manager.create(FormTemplateModule, {
            template: savedTemplate,
            module: existingModule,
            displayOrder: moduleData.displayOrder,
            isRequired: moduleData.isRequired,
            isActive: moduleData.isActive
          })

          await queryRunner.manager.save(FormTemplateModule, templateModule)
        }
      }

      await queryRunner.commitTransaction()

      const completeTemplate = await this.getTemplateWithModules(savedTemplate.id)

      if (!completeTemplate) {
        throw new ServerError('Error al recuperar la plantilla creada')
      }

      return completeTemplate
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },

  async getTemplateWithModules(id: string): Promise<FormTemplate | null> {
    return await this.findOne({
      where: { id },
      relations: [
        'createdBy',
        'createdBy.role',
        'moduleAssignments',
        'moduleAssignments.module',
        'moduleAssignments.module.fields',
        'moduleAssignments.module.fields.options'
      ],
      order: {
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
    })
  },

  async updateTemplateModules(templateId: string, modules: Array<{
    moduleId: string
    displayOrder: number
    isRequired: boolean
    isActive: boolean
  }>): Promise<FormTemplate> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const existingTemplate = await queryRunner.manager.findOne(FormTemplate, {
        where: { id: templateId }
      })

      if (!existingTemplate) {
        throw new NotFoundError(`No se encontró el formulario con ID: ${templateId}`)
      }

      const existingAssignments = await queryRunner.manager.find(FormTemplateModule, {
        where: { template: { id: templateId } }
      })

      if (existingAssignments.length > 0) {
        await queryRunner.manager.remove(FormTemplateModule, existingAssignments)
      }

      if (modules && modules.length > 0) {
        for (const moduleData of modules) {
          const existingModule = await queryRunner.manager.findOne(FormModule, {
            where: { id: moduleData.moduleId, isActive: true }
          })

          if (!existingModule) {
            throw new NotFoundError(
              `No se encontró el módulo con ID: ${moduleData.moduleId}`
            )
          }

          const templateModule = queryRunner.manager.create(FormTemplateModule, {
            template: existingTemplate,
            module: existingModule,
            displayOrder: moduleData.displayOrder,
            isRequired: moduleData.isRequired,
            isActive: moduleData.isActive
          })

          await queryRunner.manager.save(FormTemplateModule, templateModule)
        }
      }

      await queryRunner.commitTransaction()

      const updatedTemplate = await this.getTemplateWithModules(templateId)

      if (!updatedTemplate) {
        throw new ServerError('Error al recuperar el formulario actualizado')
      }

      return updatedTemplate
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },

  getFormTemplateById: async function (id: string): Promise<FormTemplate | null> {
    return await this.findOne({
      where: { id },
      relations: {
        createdBy: true,
        moduleAssignments: {
          module: {
            fields: {
              options: true
            }
          }
        }
      },
      order: {
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
    })
  },

  countActiveFormTemplates: async function (): Promise<number> {
    const count = await this.count({
      where: { status: StatusEnum.ACTIVE },
    })
    return count
  },
})

