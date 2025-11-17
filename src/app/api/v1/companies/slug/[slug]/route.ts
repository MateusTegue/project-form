import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyRepository } from '@/lib/repositories/company.repository'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const { slug } = await params

    if (!slug) {
      return formatError(new Error('Slug no proporcionado'), 400)
    }

    const company = await CompanyRepository.getCompanyBySlug(slug)

    if (!company) {
      return formatError(new Error('Company not found'), 404)
    }

    return formatResponse(company, 'Company retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

