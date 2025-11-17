import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'
import { SubmissionStatusEnum } from '@/lib/enums/EnumEntity'

export async function PATCH(
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

    // Validar que el body tenga status
    if (!body || typeof body !== 'object') {
      return formatError(new Error('Cuerpo de la petición debe ser un objeto'), 400)
    }

    if (!body.status) {
      return formatError(new Error('El campo "status" es requerido'), 400)
    }

    // Validar que el status sea un valor válido
    const validStatuses = Object.values(SubmissionStatusEnum)
    if (!validStatuses.includes(body.status)) {
      return formatError(new Error(`Status inválido. Valores válidos: ${validStatuses.join(', ')}`), 400)
    }

    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : (authResult.user.role as any)?.name

    const reviewedBy = userRole === 'COMPANY' ? authResult.user.id : undefined

    const submission = await FormSubmissionRepository.updateSubmissionStatus(
      id,
      body.status,
      reviewedBy
    )

    if (!submission) {
      return formatError(new Error('Submission not found'), 404)
    }

    // Actualizar reviewNotes si está presente
    if (body.reviewNotes !== undefined) {
      submission.reviewNotes = body.reviewNotes && body.reviewNotes.trim() !== '' 
        ? body.reviewNotes.trim() 
        : undefined
      await FormSubmissionRepository.save(submission)
    }

    return formatResponse(submission, 'Submission status updated successfully')
  } catch (error) {
    return formatError(error)
  }
}

