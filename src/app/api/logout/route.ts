import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Sesión cerrada correctamente' 
      },
      { status: 200 }
    )
    response.cookies.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0),
      path: '/'
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error al cerrar sesión',
      },
      { status: 500 }
    )
  }
}