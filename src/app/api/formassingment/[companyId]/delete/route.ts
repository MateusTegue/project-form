import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { companyId: assignmentId } = await params

    const assignment = await CompanyFormAssignmentRepository.deactivateAssignment(assignmentId)

    return formatResponse(assignment, 'Assignment deactivated successfully')
  } catch (error) {
    return formatError(error)
  }
}