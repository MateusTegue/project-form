import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormTemplateRepository } from '@/lib/repositories/formtemplate.repository'
import { z } from 'zod'

const updateModulesSchema = z.object({
  modules: z.array(z.object({
    moduleId: z.string().uuid(),
    displayOrder: z.number(),
    isRequired: z.boolean(),
    isActive: z.boolean(),
  })),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const body = await req.json()
    const validatedData = updateModulesSchema.parse(body)

    const template = await FormTemplateRepository.updateTemplateModules(
      params.id,
      validatedData.modules
    )

    return formatResponse(template, 'Form template modules updated successfully')
  } catch (error) {
    return formatError(error)
  }
}

