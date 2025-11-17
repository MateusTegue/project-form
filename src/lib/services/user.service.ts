import Service from './base'
import { User } from '../database/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { hashPassword } from '../utils/bcrypt'
import { NotFoundError, ConflictError } from '../helpers/exceptions-errors'
import { StatusEnum } from '../enums/EnumEntity'

interface CreateUserData {
  firstName: string
  secondName?: string
  firstMiddleName: string
  secondMiddleName?: string
  email: string
  codePhone: string
  phone: string
  username: string
  password: string
  roleId: string
}

interface UpdateUserData {
  firstName?: string
  secondName?: string
  firstMiddleName?: string
  secondMiddleName?: string
  email?: string
  codePhone?: string
  phone?: string
  username?: string
  password?: string
  roleId?: string
}

interface UpdateProfileData {
  firstName?: string
  secondName?: string | null
  firstMiddleName?: string
  secondMiddleName?: string | null
  email?: string
  codePhone?: string
  phone?: string
  username?: string
}

class UserService extends Service<User, typeof UserRepository> {
  constructor() {
    super(UserRepository)
  }

  public async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await hashPassword(data.password)

    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword 
    }, data.roleId)
    
    return user
  }

  public async updateUser(id: string, data: Partial<UpdateUserData>): Promise<User> {
    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    await this.repository.update(id, data)
    const updatedUser = await this.repository.findOneBy({ id })

    if (updatedUser === null) throw new NotFoundError('User not found')

    return updatedUser
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.repository.findOneBy({ id })

    if (user === null) throw new NotFoundError('User not found')

    user.status = StatusEnum.INACTIVE

    await this.repository.save(user)
  }

  public async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['role'],
    })

    if (!user) {
      throw new NotFoundError('Usuario no encontrado')
    }

    if (data.email && data.email !== user.email) {
      const existingUserWithEmail = await this.repository.findOne({
        where: { email: data.email },
      })

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        throw new ConflictError('El email ya está en uso por otro usuario')
      }
    }

    if (data.username && data.username !== user.username) {
      const existingUserWithUsername = await this.repository.findOne({
        where: { username: data.username },
      })

      if (existingUserWithUsername && existingUserWithUsername.id !== userId) {
        throw new ConflictError('El nombre de usuario ya está en uso')
      }
    }

    const updateData: Record<string, string | undefined> = {}
    
    if (data.firstName !== undefined && data.firstName !== '') {
      updateData.firstName = data.firstName
    }
    if (data.secondName !== undefined) {
      updateData.secondName = data.secondName === null ? undefined : data.secondName
    }
    if (data.firstMiddleName !== undefined && data.firstMiddleName !== '') {
      updateData.firstMiddleName = data.firstMiddleName
    }
    if (data.secondMiddleName !== undefined) {
      updateData.secondMiddleName = data.secondMiddleName === null ? undefined : data.secondMiddleName
    }
    if (data.email !== undefined && data.email !== '') {
      updateData.email = data.email
    }
    if (data.codePhone !== undefined && data.codePhone !== '') {
      updateData.codePhone = data.codePhone
    }
    if (data.phone !== undefined && data.phone !== '') {
      updateData.phone = data.phone
    }
    if (data.username !== undefined && data.username !== '') {
      updateData.username = data.username
    }

    if (Object.keys(updateData).length > 0) {
      await this.repository.update(userId, updateData)
    }

    const updatedUser = await this.repository.findOne({
      where: { id: userId },
      relations: ['role'],
    })

    if (!updatedUser) {
      throw new NotFoundError('Usuario no encontrado después de la actualización')
    }

    const userResponse = { ...updatedUser }
    delete (userResponse as any).password
    
    return userResponse as User
  }
}

export default UserService
