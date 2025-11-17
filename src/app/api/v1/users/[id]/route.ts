import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import UserService from '@/lib/services/user.service'
import { z } from 'zod'

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  secondName: z.string().optional(),
  firstMiddleName: z.string().optional(),
  secondMiddleName: z.string().optional(),
  email: z.string().email().optional(),
  codePhone: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().uuid().optional(),
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
    const validatedData = updateUserSchema.parse(body)

    const userService = new UserService()
    const user = await userService.updateUser(id, validatedData)

    return formatResponse(user, 'User updated successfully')
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
    const userService = new UserService()
    await userService.deleteUser(id)

    return formatResponse(null, 'User deleted successfully', 204)
  } catch (error) {
    return formatError(error)
  }
}

