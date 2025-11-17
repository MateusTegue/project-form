import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'
import { z } from 'zod'

const assignFormSchema = z.object({
  companyId: z.string().uuid(),
  formTemplateId: z.string().uuid(),
  allowMultipleSubmissions: z.boolean().optional(),
  allowEditAfterSubmit: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
  customConfig: z.any().optional(),
})

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const body = await req.json()
    const validatedData = assignFormSchema.parse(body)

    const assignment = await CompanyFormAssignmentRepository.assignFormToCompany(validatedData)

    return formatResponse(assignment, 'Form assigned to company successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}

