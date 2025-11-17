import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'
import { PermissionDeniedError } from '@/lib/helpers/exceptions-errors'
import { RoleEnum } from '@/lib/enums/EnumEntity'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { companyId } = await params

    // Si es COMPANY, verificar que solo pueda acceder a sus propios datos
    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    if (userRole === RoleEnum.COMPANY && authResult.user.id !== companyId) {
      return formatError(new PermissionDeniedError('No tienes permisos para acceder a esta información'))
    }

    const assignments = await CompanyFormAssignmentRepository.getCompanyAssignments(companyId)

    return formatResponse(assignments, 'Assignments retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}