import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { UserRepository } from '../repositories/user.repository'
import { CompanyRepository } from '../repositories/company.repository'
import { StatusEnum } from '../enums/EnumEntity'
import { NotAuthorizedError, PermissionDeniedError } from '../helpers/exceptions-errors'
import { http, ResponseCode } from '../helpers/request'

export const authService = {
  login: async (identifier: string, password: string) => {
    const company = await CompanyRepository.findByEmailOrUsername(identifier)
    if (company) {
      if (company.status !== StatusEnum.ACTIVE)
        throw new PermissionDeniedError('La compañía está inactiva')

      const isPasswordValid = await bcrypt.compare(password, company.contactPassword)
      if (!isPasswordValid) throw new NotAuthorizedError('Credenciales inválidas')

      const token = jwt.sign(
        {
          id: company.id,
          identifier: company.contactEmail,
          role: 'COMPANY',
          type: 'company',
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' }
      )

      const { contactPassword, ...companyWithoutPassword } = company
      return { token, user: companyWithoutPassword }
    }

    const user = await UserRepository.findByEmailOrUsername(identifier)
    if (user) {
      if (user.status !== StatusEnum.ACTIVE)
        throw new PermissionDeniedError('El usuario está inactivo')

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) throw new NotAuthorizedError('Credenciales inválidas')

      const roleName = typeof user.role === 'object' && user.role !== null && 'name' in user.role 
        ? user.role.name 
        : (user.role as any)?.name || 'USER'

      const token = jwt.sign(
        {
          id: user.id,
          identifier: user.email,
          username: user.username,
          role: roleName,
          type: 'user',
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' }
      )

      const { password: _, ...userWithoutPassword } = user
      return { token, user: userWithoutPassword }
    }

    throw new NotAuthorizedError('Credenciales inválidas')
  },
}

