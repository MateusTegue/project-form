import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import OtpService from '@/lib/services/otp.service'
import { OtpTypeEnum } from '@/lib/enums/EnumEntity'
import { z } from 'zod'

const generateOtpSchema = z.object({
  email: z.string().email('Email inválido'),
  type: z.nativeEnum(OtpTypeEnum).optional(),
})

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const body = await req.json()
    const validatedData = generateOtpSchema.parse(body)

    const otpService = new OtpService()
    const result = await otpService.generateOtp(
      validatedData.email,
      validatedData.type || OtpTypeEnum.RESET_PASSWORD
    )

    return formatResponse(
      {
        expiresAt: result.expiresAt,
        code: process.env.NODE_ENV === 'development' ? result.code : undefined,
      },
      'Código OTP generado exitosamente. Revisa tu correo electrónico.'
    )
  } catch (error) {
    return formatError(error)
  }
}

