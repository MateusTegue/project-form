import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { BadRequestError } from '@/lib/helpers/exceptions-errors'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const { token } = await params
    
    if (!token) {
      return formatError(new BadRequestError('Token no proporcionado'))
    }

    let body: any
    try {
      body = await req.json()
    } catch (error) {
      return formatError(new BadRequestError('Cuerpo de la petición inválido'))
    }

    // Validar datos básicos
    if (!body || typeof body !== 'object') {
      return formatError(new BadRequestError('Cuerpo de la petición debe ser un objeto'))
    }

    if (!body.answers || typeof body.answers !== 'object') {
      return formatError(new BadRequestError('El campo "answers" es requerido'))
    }

    // Validar email si está presente
    if (body.submitterEmail && body.submitterEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.submitterEmail)) {
        return formatError(new BadRequestError('El email proporcionado no es válido'))
      }
    }

    // Normalizar campos opcionales vacíos
    const normalizedData = {
      submitterEmail: body.submitterEmail && typeof body.submitterEmail === 'string' && body.submitterEmail.trim() !== '' 
        ? body.submitterEmail.trim() 
        : undefined,
      submitterName: body.submitterName && typeof body.submitterName === 'string' && body.submitterName.trim() !== '' 
        ? body.submitterName.trim() 
        : undefined,
      submitterPhone: body.submitterPhone && typeof body.submitterPhone === 'string' && body.submitterPhone.trim() !== '' 
        ? body.submitterPhone.trim() 
        : undefined,
      submitterDocumentId: body.submitterDocumentId && typeof body.submitterDocumentId === 'string' && body.submitterDocumentId.trim() !== '' 
        ? body.submitterDocumentId.trim() 
        : undefined,
      answers: body.answers || {},
    }

    // Obtener IP y User Agent del cliente
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      req.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    const submission = await FormSubmissionRepository.createSubmission({
      publicToken: token,
      submitterEmail: normalizedData.submitterEmail,
      submitterName: normalizedData.submitterName,
      submitterPhone: normalizedData.submitterPhone,
      submitterDocumentId: normalizedData.submitterDocumentId,
      answers: normalizedData.answers,
      ipAddress,
      userAgent,
    })

    return formatResponse(submission, 'Form submission created successfully', 201)
  } catch (error: any) {
    console.error('[POST /api/public/form/[token]/submit] Error:', error)
    return formatError(error)
  }
}