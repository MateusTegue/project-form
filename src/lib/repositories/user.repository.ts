import { DeepPartial } from 'typeorm'
import { AppDataSource } from '../database/data-source'
import { User } from '../database/entities/user'
import { Role } from '../database/entities/role'
import { ConflictError, ServerError, NotFoundError } from '../helpers/exceptions-errors'

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByEmailOrUsername: async function (identifier: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('LOWER(user.email) = LOWER(:identifier)', { identifier })
      .orWhere('LOWER(user.username) = LOWER(:identifier)', { identifier })
      .getOne()
  },

  async createUser(body: DeepPartial<User>, roleId: string) {
    try {
      const role = await AppDataSource.getRepository(Role).findOneBy({ id: roleId })
      if (!role) {
        throw new Error(`Role con id ${roleId} no existe`)
      }

      const existing = await this.findOne({
        where: [{ email: body.email }, { username: body.username }],
      })

      if (existing) {
        throw new ConflictError(`El email ${body.email} ya está en uso`, { email: body.email })
      }

      const user = this.create({
        ...body,
        role,
      })
      
      return await this.save(user)
    } catch (error) {
      throw new ServerError('Error al crear el usuario', { cause: error })
    }
  },

  getAllAdmins: async function (): Promise<User[]> {
    const users = await this.find({
      relations: ['role'],
      where: { role: { name: 'ADMIN_ALIADO' as any } },
    })

    if (users.length === 0) {
      throw new NotFoundError('No admins found')
    }

    return users
  },
})

