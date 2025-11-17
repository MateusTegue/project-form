import { NextRequest, NextResponse } from "next/server";
import { authService } from '@/lib/services/auth.service'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { z } from 'zod'

const loginSchema = z.object({
  identifier: z.string().min(1, 'El identificador es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const body = await req.json()
    const validatedData = loginSchema.parse(body)

    const result = await authService.login(validatedData.identifier, validatedData.password)

    const response = formatResponse(result, 'Login successful')
    
    // Establecer cookie con el token
    response.cookies.set('auth_token', result.token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
    })

    // Establecer cookie con información del usuario para el middleware
    if (result.user) {
      const user = result.user
      const userRole = typeof user.role === 'object' && user.role !== null && 'name' in user.role
        ? user.role.name
        : (user.role as string) || 'COMPANY'
      
      response.cookies.set({
        name: 'user',
        value: JSON.stringify({
          id: user.id,
          role: userRole,
          type: (user as any).type || 'company'
        }),
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600,
      })
    }

    return response
  } catch (error) {
    return formatError(error)
  }
}
