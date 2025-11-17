import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from '../helpers/exceptions-errors'
import { http, ResponseCode } from '../helpers/request'

export interface AuthenticatedUser {
  id: string
  email?: string
  username?: string
  identifier?: string
  role: string | { name: string }
  type?: string
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser
}

export const authMiddleware = async (
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> => {
  try {
    let token: string | undefined

    const cookieToken = req.cookies.get('auth_token')?.value
    if (cookieToken) {
      token = cookieToken
    } else {
      const authHeader = req.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
      }
    }

    if (!token) {
      return NextResponse.json(
        http.error(null, ResponseCode.NOT_AUTHORIZED, ['Token de autenticación requerido']),
        { status: ResponseCode.NOT_AUTHORIZED }
      )
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as AuthenticatedUser

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        http.error(null, ResponseCode.NOT_AUTHORIZED, ['Token inválido']),
        { status: ResponseCode.NOT_AUTHORIZED }
      )
    }

    return { user: decoded }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        http.error(null, ResponseCode.NOT_AUTHORIZED, ['El token de autenticación no es válido']),
        { status: ResponseCode.NOT_AUTHORIZED }
      )
    }

    if (err instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        http.error(null, ResponseCode.NOT_AUTHORIZED, ['El token de autenticación ha expirado']),
        { status: ResponseCode.NOT_AUTHORIZED }
      )
    }

    return NextResponse.json(
      http.error(null, ResponseCode.NOT_AUTHORIZED, [err instanceof Error ? err.message : 'Error de autenticación']),
      { status: ResponseCode.NOT_AUTHORIZED }
    )
  }
}

