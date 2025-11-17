import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { BadRequestError, NotFoundError } from '@/lib/helpers/exceptions-errors'
import { CompanyRepository } from '@/lib/repositories/company.repository'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const { slug } = await params

    if (!slug) {
      return formatError(new BadRequestError('Slug no proporcionado'))
    }

    const company = await CompanyRepository.getCompanyBySlug(slug)

    if (!company) {
      return formatError(new NotFoundError('Empresa no encontrada'))
    }

    return formatResponse(company, 'Company retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

