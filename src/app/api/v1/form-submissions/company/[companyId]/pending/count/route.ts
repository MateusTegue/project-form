import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const count = await FormSubmissionRepository.countPendingByCompany(params.companyId)

    return formatResponse({ count }, 'Pending submissions count retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

