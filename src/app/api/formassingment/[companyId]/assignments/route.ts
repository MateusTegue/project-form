import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'

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

    if (!companyId) {
      return formatError(new Error('ID de compañía no proporcionado'))
    }

    const assignments = await CompanyFormAssignmentRepository.getAssignedTemplatesByCompanyId(companyId)

    return formatResponse(assignments, 'Assignments retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}