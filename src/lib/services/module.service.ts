import Service from './base'
import { FormModule } from '../database/entities/formodule'
import { FormModuleRepository } from '../repositories/module.repository'
import { NotFoundError } from '../helpers/exceptions-errors'

interface UpdateModuleData {
  name?: string
  description?: string | null
  isActive?: boolean
  fields?: any[]
}

class ModuleService extends Service<FormModule, typeof FormModuleRepository> {
  constructor() {
    super(FormModuleRepository)
  }

  public async updateModule(id: string, data: Partial<UpdateModuleData>): Promise<FormModule> {
    const module = await this.repository.findOneBy({ id })

    if (module === null) {
      throw new NotFoundError('Module not found')
    }

    if (data.fields !== undefined) {
      return await this.repository.updateModuleWithFields(id, data)
    }

    const updateData: any = {
      ...data,
    }

    if ('description' in updateData && updateData.description === null) {
      updateData.description = undefined
    }

    await this.repository.update(id, updateData)

    const updatedModule = await this.repository.findOne({
      where: { id },
      relations: ['fields', 'fields.options'],
      order: {
        fields: { displayOrder: 'ASC' }
      }
    })

    if (updatedModule === null) {
      throw new NotFoundError('Module not found after update')
    }

    return updatedModule
  }

  public async deleteModule(id: string): Promise<void> {
    const module = await this.repository.findOne({
      where: { id },
      relations: ['templateAssignments']
    })

    if (module === null) {
      throw new NotFoundError('Module not found')
    }

    if (module.templateAssignments && module.templateAssignments.length > 0) {
      module.isActive = false
      await this.repository.save(module)
    } else {
      await this.repository.remove(module)
    }
  }
}

export default ModuleService

