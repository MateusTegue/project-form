import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import ModuleService from '@/lib/services/module.service'
import { z } from 'zod'

const updateModuleSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  fields: z.array(z.any()).optional(),
})

export async function PUT(
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
    const body = await req.json()
    const validatedData = updateModuleSchema.parse(body)

    const moduleService = new ModuleService()
    const module = await moduleService.updateModule(id, validatedData)

    return formatResponse(module, 'Module updated successfully')
  } catch (error) {
    return formatError(error)
  }
}

export async function DELETE(
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
    const moduleService = new ModuleService()
    await moduleService.deleteModule(id)

    return formatResponse(null, 'Module deleted successfully', 204)
  } catch (error) {
    return formatError(error)
  }
}

