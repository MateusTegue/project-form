import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'
import { SubmissionStatusEnum } from '@/lib/enums/EnumEntity'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.nativeEnum(SubmissionStatusEnum),
  reviewNotes: z.string().optional(),
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
    const validatedData = updateStatusSchema.parse(body)

    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    const reviewedBy = userRole === 'COMPANY' ? authResult.user.id : undefined

    const submission = await FormSubmissionRepository.updateSubmissionStatus(
      id,
      validatedData.status,
      reviewedBy
    )

    if (!submission) {
      return formatError(new Error('Submission not found'), 404)
    }

    if (validatedData.reviewNotes !== undefined) {
      submission.reviewNotes = validatedData.reviewNotes && validatedData.reviewNotes.trim() !== '' 
        ? validatedData.reviewNotes.trim() 
        : undefined
      await FormSubmissionRepository.save(submission)
    }

    return formatResponse(submission, 'Submission status updated successfully')
  } catch (error) {
    return formatError(error)
  }
}

