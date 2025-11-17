import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import ChangePasswordService from '@/lib/services/changePassword.service'
import { z } from 'zod'

const changePasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  otpCode: z.string().length(6, 'El código OTP debe tener 6 dígitos'),
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const body = await req.json()
    const validatedData = changePasswordSchema.parse(body)

    const changePasswordService = new ChangePasswordService()

    try {
      await changePasswordService.changePassword(
        validatedData.email,
        validatedData.otpCode,
        validatedData.newPassword
      )
    } catch (error: any) {
      if (error.message?.includes('Usuario no encontrado')) {
        await changePasswordService.changeCompanyPassword(
          validatedData.email,
          validatedData.otpCode,
          validatedData.newPassword
        )
      } else {
        throw error
      }
    }

    return formatResponse(null, 'Contraseña actualizada exitosamente')
  } catch (error) {
    return formatError(error)
  }
}

