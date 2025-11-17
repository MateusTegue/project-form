import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import UserService from '@/lib/services/user.service'
import { z } from 'zod'

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  secondName: z.string().nullable().optional(),
  firstMiddleName: z.string().optional(),
  secondMiddleName: z.string().nullable().optional(),
  email: z.string().email().optional(),
  codePhone: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    if (!authResult.user || !authResult.user.id) {
      return formatError(new Error('Usuario no autenticado'))
    }

    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    const userService = new UserService()
    const updatedUser = await userService.updateProfile(authResult.user.id, validatedData)

    return formatResponse(updatedUser, 'Perfil actualizado exitosamente')
  } catch (error) {
    return formatError(error)
  }
}

