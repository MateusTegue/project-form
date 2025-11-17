import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { NotFoundError } from '@/lib/helpers/exceptions-errors'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'

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

    const submission = await FormSubmissionRepository.getSubmissionById(id)

    if (!submission) {
      return formatError(new NotFoundError('Submission not found'))
    }

    return formatResponse(submission, 'Submission retrieved successfully')
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

    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    const reviewedBy = userRole === 'COMPANY' ? authResult.user.id : undefined

    const submission = await FormSubmissionRepository.deleteSubmissionById(id, reviewedBy)

    return formatResponse(submission, 'Submission deleted successfully')
  } catch (error) {
    return formatError(error)
  }
}
