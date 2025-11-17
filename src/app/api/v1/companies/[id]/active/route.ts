import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import CompanyService from '@/lib/services/company.service'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const companyService = new CompanyService()
    await companyService.activeCompany(params.id)

    return formatResponse(null, 'Company activated successfully')
  } catch (error) {
    return formatError(error)
  }
}

