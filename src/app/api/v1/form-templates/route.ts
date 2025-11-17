import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormTemplateRepository } from '@/lib/repositories/formtemplate.repository'
import { z } from 'zod'

const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateType: z.string().min(1),
  modules: z.array(z.object({
    moduleId: z.string().uuid(),
    displayOrder: z.number(),
    isRequired: z.boolean(),
    isActive: z.boolean(),
  })),
})

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const templates = await FormTemplateRepository.getAllFormTemplatesWithModules()

    return formatResponse(templates, 'Form templates retrieved successfully')
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
    const validatedData = createTemplateSchema.parse(body)

    const template = await FormTemplateRepository.createTemplateWithModules({
      ...validatedData,
      createdBy: authResult.user.id,
    })

    return formatResponse(template, 'Form template created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}

