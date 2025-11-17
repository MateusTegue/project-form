import { NextRequest, NextResponse } from 'next/server'
import { PermissionDeniedError } from '../helpers/exceptions-errors'
import { RoleEnum } from '../enums/EnumEntity'
import { http, ResponseCode } from '../helpers/request'
import { AuthenticatedUser } from './auth.middleware'

export const roleMiddleware = (allowedRoles: (RoleEnum | string)[]) => {
  return (user: AuthenticatedUser): NextResponse | null => {
    try {
      let userRole: string
      if (typeof user.role === 'string') {
        userRole = user.role
      } else if (user.role && typeof user.role === 'object' && 'name' in user.role) {
        userRole = user.role.name
      } else {
        return NextResponse.json(
          http.error(null, ResponseCode.PERMISSION_DENIED, ['Rol de usuario no válido']),
          { status: ResponseCode.PERMISSION_DENIED }
        )
      }

      if (userRole === RoleEnum.SUPER_ADMIN) {
        return null
      }

      const hasPermission = allowedRoles.some((role) => {
        if (typeof role === 'string') {
          return role === userRole
        }
        return role === userRole
      })

      if (!hasPermission) {
        return NextResponse.json(
          http.error(null, ResponseCode.PERMISSION_DENIED, [`No tienes permisos para acceder a este recurso. Rol requerido: ${allowedRoles.join(' o ')}`]),
          { status: ResponseCode.PERMISSION_DENIED }
        )
      }

      return null
    } catch (err) {
      return NextResponse.json(
        http.error(null, ResponseCode.PERMISSION_DENIED, [err instanceof Error ? err.message : 'Error al verificar permisos']),
        { status: ResponseCode.PERMISSION_DENIED }
      )
    }
  }
}

export const superAdminOnly = roleMiddleware([RoleEnum.SUPER_ADMIN])
export const adminOnly = roleMiddleware([RoleEnum.ADMIN_ALIADO])
export const adminOrSuperAdmin = roleMiddleware([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_ALIADO])
export const companyOnly = roleMiddleware([RoleEnum.COMPANY])
export const superAdminOrCompany = roleMiddleware([RoleEnum.SUPER_ADMIN, RoleEnum.COMPANY])

