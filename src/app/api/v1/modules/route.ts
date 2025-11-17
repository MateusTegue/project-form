import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormModuleRepository } from '@/lib/repositories/module.repository'
import { z } from 'zod'

const createModuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  moduleKey: z.string().min(1),
  fields: z.array(z.any()).optional(),
})

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const modules = await FormModuleRepository.getAllModules()

    return formatResponse(modules, 'Modules retrieved successfully')
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
    const validatedData = createModuleSchema.parse(body)

    const module = await FormModuleRepository.createModuleWithFields(validatedData)

    return formatResponse(module, 'Module created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}

