import { AppDataSource } from '../database/data-source'
import { FormModule } from '../database/entities/formodule'
import { FormField } from '../database/entities/formfield'
import { FieldOption } from '../database/entities/fieldoption'
import { NotFoundError, ConflictError, ServerError } from '../helpers/exceptions-errors'

interface CreateModuleInput {
  name: string
  description?: string
  moduleKey: string
  fields?: any[]
}

export const FormModuleRepository = AppDataSource.getRepository(FormModule).extend({
  getAllModules: async function (): Promise<FormModule[]> {
    const modules = await this.find({
      relations: ['fields'],
      order: { 
        created_at: 'DESC',
        fields: { created_at: 'ASC' } 
      },
    })

    if (modules.length === 0) {
      throw new NotFoundError('No modules found')
    }

    return modules
  },

  async createModuleWithFields(data: CreateModuleInput): Promise<FormModule> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const existingModule = await queryRunner.manager.findOne(FormModule, {
        where: { moduleKey: data.moduleKey }
      })

      if (existingModule) {
        throw new ConflictError(
          `Ya existe un módulo con la clave "${data.moduleKey}"`,
          { moduleKey: data.moduleKey }
        )
      }

      const module = queryRunner.manager.create(FormModule, {
        name: data.name,
        description: data.description,
        moduleKey: data.moduleKey,
        isActive: true
      })

      const savedModule = await queryRunner.manager.save(FormModule, module)

      if (data.fields && data.fields.length > 0) {
        for (const fieldData of data.fields) {
          const field = queryRunner.manager.create(FormField, {
            label: fieldData.label,
            fieldKey: fieldData.fieldKey,
            fieldType: fieldData.fieldType,
            placeholder: fieldData.placeholder,
            helpText: fieldData.helpText,
            isRequired: fieldData.isRequired ?? false,
            displayOrder: fieldData.displayOrder ?? 0,
            isActive: fieldData.isActive ?? true,
            validations: fieldData.validations,
            layoutConfig: fieldData.layoutConfig,
            module: savedModule
          })

          const savedField = await queryRunner.manager.save(FormField, field)

          if (fieldData.options && fieldData.options.length > 0) {
            const options = fieldData.options.map((opt: any) =>
              queryRunner.manager.create(FieldOption, {
                label: opt.label,
                value: opt.value,
                displayOrder: opt.displayOrder ?? 0,
                isActive: opt.isActive ?? true,
                field: savedField
              })
            )
            await queryRunner.manager.save(FieldOption, options)
          }
        }
      }

      await queryRunner.commitTransaction()

      const completeModule = await this.findOne({
        where: { id: savedModule.id },
        relations: ['fields', 'fields.options'],
        order: {
          fields: { displayOrder: 'ASC' }
        }
      })

      if (!completeModule) {
        throw new ServerError('Error al recuperar el módulo creado')
      }

      return completeModule
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },

  countActiveFormModules: async function (): Promise<number> {
    const count = await this.count({
      where: { isActive: true },
    })
    return count
  },

  async updateModuleWithFields(moduleId: string, data: any): Promise<FormModule> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const existingModule = await queryRunner.manager.findOne(FormModule, {
        where: { id: moduleId },
        relations: ['fields', 'fields.options']
      })

      if (!existingModule) {
        throw new ConflictError(`Módulo con ID "${moduleId}" no encontrado`)
      }

      if (data.name !== undefined) existingModule.name = data.name
      if (data.description !== undefined) existingModule.description = data.description === null ? undefined : data.description
      if (data.isActive !== undefined) existingModule.isActive = data.isActive

      await queryRunner.manager.save(FormModule, existingModule)

      if (data.fields !== undefined) {
        const existingFields = existingModule.fields || []
        
        if (data.fields.length === 0) {
          if (existingFields.length > 0) {
            await queryRunner.manager.remove(FormField, existingFields)
          }
        } else {
          const existingFieldIds = new Set(existingFields.map(f => f.id))
          const newFieldIds = new Set(data.fields.filter((f: any) => f.id).map((f: any) => f.id))

          const fieldsToDelete = existingFields.filter(f => !newFieldIds.has(f.id))
          if (fieldsToDelete.length > 0) {
            await queryRunner.manager.remove(FormField, fieldsToDelete)
          }

          for (const fieldData of data.fields) {
            if (fieldData.id && existingFieldIds.has(fieldData.id)) {
              const existingField = existingFields.find(f => f.id === fieldData.id)
              if (existingField) {
                existingField.label = fieldData.label
                existingField.fieldKey = fieldData.fieldKey
                existingField.fieldType = fieldData.fieldType
                existingField.placeholder = fieldData.placeholder
                existingField.helpText = fieldData.helpText === null ? undefined : fieldData.helpText
                existingField.isRequired = fieldData.isRequired ?? false
                existingField.displayOrder = fieldData.displayOrder ?? 0
                existingField.isActive = fieldData.isActive ?? true
                existingField.validations = fieldData.validations
                existingField.layoutConfig = fieldData.layoutConfig

                const savedField = await queryRunner.manager.save(FormField, existingField)

                if (fieldData.options !== undefined) {
                  const existingOptions = await queryRunner.manager.find(FieldOption, {
                    where: { field: { id: savedField.id } }
                  })

                  const existingOptionIds = new Set(existingOptions.map(o => o.id))
                  const newOptionIds = new Set(fieldData.options.filter((o: any) => o.id).map((o: any) => o.id))

                  const optionsToDelete = existingOptions.filter(o => !newOptionIds.has(o.id))
                  if (optionsToDelete.length > 0) {
                    await queryRunner.manager.remove(FieldOption, optionsToDelete)
                  }

                  for (const optionData of fieldData.options) {
                    if (optionData.id && existingOptionIds.has(optionData.id)) {
                      const existingOption = existingOptions.find(o => o.id === optionData.id)
                      if (existingOption) {
                        existingOption.label = optionData.label
                        existingOption.value = optionData.value
                        existingOption.displayOrder = optionData.displayOrder ?? 0
                        existingOption.isActive = optionData.isActive ?? true
                        await queryRunner.manager.save(FieldOption, existingOption)
                      }
                    } else {
                      const newOption = queryRunner.manager.create(FieldOption, {
                        label: optionData.label,
                        value: optionData.value,
                        displayOrder: optionData.displayOrder ?? 0,
                        isActive: optionData.isActive ?? true,
                        field: savedField
                      })
                      await queryRunner.manager.save(FieldOption, newOption)
                    }
                  }
                }
              }
            } else {
              const newField = queryRunner.manager.create(FormField, {
                label: fieldData.label,
                fieldKey: fieldData.fieldKey,
                fieldType: fieldData.fieldType,
                placeholder: fieldData.placeholder,
                helpText: fieldData.helpText === null ? undefined : fieldData.helpText,
                isRequired: fieldData.isRequired ?? false,
                displayOrder: fieldData.displayOrder ?? 0,
                isActive: fieldData.isActive ?? true,
                validations: fieldData.validations,
                layoutConfig: fieldData.layoutConfig,
                module: existingModule
              })

              const savedField = await queryRunner.manager.save(FormField, newField)

              if (fieldData.options && fieldData.options.length > 0) {
                const options = fieldData.options.map((opt: any) =>
                  queryRunner.manager.create(FieldOption, {
                    label: opt.label,
                    value: opt.value,
                    displayOrder: opt.displayOrder ?? 0,
                    isActive: opt.isActive ?? true,
                    field: savedField
                  })
                )
                await queryRunner.manager.save(FieldOption, options)
              }
            }
          }
        }
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }

    const completeModule = await this.findOne({
      where: { id: moduleId },
      relations: ['fields', 'fields.options'],
      order: {
        fields: { displayOrder: 'ASC' }
      }
    })

    if (!completeModule) {
      throw new ServerError('Error al recuperar el módulo actualizado')
    }

    return completeModule
  },
})

