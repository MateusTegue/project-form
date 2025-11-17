import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyRepository } from '@/lib/repositories/company.repository'
import { hashPassword } from '@/lib/utils/bcrypt'
import { generateSlug } from '@/lib/utils/slug'
import { z } from 'zod'

const createCompanySchema = z.object({
  name: z.string().min(1),
  nit: z.string().min(1),
  razonSocial: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  logoUrl: z.string().optional(),
  roleId: z.string().uuid(),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  contactPhoneCountryCode: z.string().min(1),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  contactPassword: z.string().min(6),
  redirectUrl: z.string().optional(),
  companyInfo: z.any().optional(),
})

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const companies = await CompanyRepository.find({
      relations: ['role', 'createdBy'],
      order: { created_at: 'DESC' }
    } as any)

    return formatResponse(companies, 'Companies retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const body = await req.json()
    const validatedData = createCompanySchema.parse(body)

    const hashedPassword = await hashPassword(validatedData.contactPassword)
    const companySlug = generateSlug(validatedData.name)

    const company = await CompanyRepository.createCompany({
      ...validatedData,
      contactPassword: hashedPassword,
      companySlug,
      createdBy: { id: authResult.user.id }
    })

    return formatResponse(company, 'Company created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}

