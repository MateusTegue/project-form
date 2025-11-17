import { AppDataSource } from '../database/data-source'
import { NotFoundError } from '../helpers/exceptions-errors'
import { Role } from '../database/entities/role'

export const RoleRepository = AppDataSource.getRepository(Role).extend({
  getAllRoles: async function (): Promise<Role[]> {
    const roles = await this.find()

    if (roles.length === 0) {
      throw new NotFoundError('No roles found')
    }

    return roles
  },
})

