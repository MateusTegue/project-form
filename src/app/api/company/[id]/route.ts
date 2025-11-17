import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import CompanyService from '@/lib/services/company.service'
import { PermissionDeniedError } from '@/lib/helpers/exceptions-errors'
import { RoleEnum } from '@/lib/enums/EnumEntity'
import { z } from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { id } = await params

    if (!id) {
      return formatError(new Error('ID de compañía no proporcionado'))
    }

    // Si es COMPANY, verificar que solo pueda acceder a sus propios datos
    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    if (userRole === RoleEnum.COMPANY && authResult.user.id !== id) {
      return formatError(new PermissionDeniedError('No tienes permisos para acceder a esta información'))
    }

    const companyService = new CompanyService()
    const company = await companyService.getCompanyById(id)

    if (!company) {
      return formatError(new Error('Compañía no encontrada'))
    }

    return formatResponse(company, 'Company retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

const updateCompanySchema = z.object({
  name: z.string().optional(),
  nit: z.string().optional(),
  razonSocial: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  roleId: z.string().uuid().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactPhoneCountryCode: z.string().optional(),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  contactPassword: z.string().min(6).optional(),
  redirectUrl: z.string().nullable().optional(),
  companyInfo: z.any().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { id } = await params
    const body = await req.json()
    const validatedData = updateCompanySchema.parse(body)

    // Si es COMPANY, verificar que solo pueda actualizar sus propios datos
    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    if (userRole === RoleEnum.COMPANY && authResult.user.id !== id) {
      return formatError(new PermissionDeniedError('No tienes permisos para actualizar esta información'))
    }

    const companyService = new CompanyService()
    const company = await companyService.updateCompany(id, validatedData)

    return formatResponse(company, 'Company updated successfully')
  } catch (error) {
    return formatError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { id } = await params
    const companyService = new CompanyService()
    await companyService.deleteCompany(id)

    return formatResponse(null, 'Company deleted successfully', 204)
  } catch (error) {
    return formatError(error)
  }
}
