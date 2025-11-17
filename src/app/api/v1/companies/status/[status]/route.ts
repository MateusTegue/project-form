import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyRepository } from '@/lib/repositories/company.repository'
import { StatusEnum } from '@/lib/enums/EnumEntity'

type StatusRouteParams = Promise<{ status: string }>

export async function GET(
  req: NextRequest,
  context: { params: StatusRouteParams }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const resolvedParams = await context.params
    const { status: statusParam } = resolvedParams
    const status = statusParam === 'ACTIVE' ? StatusEnum.ACTIVE : StatusEnum.INACTIVE
    const companies = await CompanyRepository.getAllCompaniesByStatus(status)

    return formatResponse(companies, 'Companies retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

