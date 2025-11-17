import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { NotFoundError, CustomError } from '@/lib/helpers/exceptions-errors'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const { token } = await params

    const assignment = await CompanyFormAssignmentRepository.getByPublicToken(token)

    if (!assignment) {
      return formatError(new NotFoundError('Formulario no encontrado o expirado'))
    }

    // Verificar si el formulario ha expirado
    if (assignment.expiresAt && new Date(assignment.expiresAt) < new Date()) {
      return formatError(new CustomError('Este formulario ha expirado', 'GONE', 410))
    }

    return formatResponse(assignment, 'Form assignment retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
} 
