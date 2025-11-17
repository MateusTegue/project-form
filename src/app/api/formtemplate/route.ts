import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormTemplateRepository } from '@/lib/repositories/formtemplate.repository'
import { z } from 'zod'

const createFormTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateType: z.enum(['PROVEEDOR', 'CLIENTE', 'TERCERO_GENERAL', 'PERSONALIZADO']).optional(),
  modules: z.array(z.object({
    moduleId: z.string().uuid(),
    displayOrder: z.number().optional(),
    isRequired: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })).optional(),
})

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    try {
      const templates = await FormTemplateRepository.getAllFormTemplatesWithModules()
      return formatResponse(templates, 'Form templates retrieved successfully')
    } catch (error: any) {
      // Si no hay templates, devolver array vacío en lugar de error
      if (error?.message?.includes('No form templates found')) {
        return formatResponse([], 'No form templates found')
      }
      throw error
    }
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
    const validatedData = createFormTemplateSchema.parse(body)

    const template = await FormTemplateRepository.createTemplateWithModules({
      name: validatedData.name,
      description: validatedData.description,
      templateType: validatedData.templateType || 'TERCERO_GENERAL',
      createdBy: authResult.user.id,
      modules: validatedData.modules || [],
    })

    return formatResponse(template, 'Form template created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}