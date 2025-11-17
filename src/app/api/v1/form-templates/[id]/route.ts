import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormTemplateRepository } from '@/lib/repositories/formtemplate.repository'

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
    const template = await FormTemplateRepository.getFormTemplateById(id)

    if (!template) {
      return formatError(new Error('Form template not found'))
    }

    return formatResponse(template, 'Form template retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

