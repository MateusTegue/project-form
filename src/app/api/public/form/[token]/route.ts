import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
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
      return formatError(new Error('Formulario no encontrado o expirado'), 404)
    }

    // Verificar si el formulario ha expirado
    if (assignment.expiresAt && new Date(assignment.expiresAt) < new Date()) {
      return formatError(new Error('Este formulario ha expirado'), 410)
    }

    return formatResponse(assignment, 'Form assignment retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
} 
