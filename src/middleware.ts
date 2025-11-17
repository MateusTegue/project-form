import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/login',
  '/forgot-password',
  '/form',
  '/company/', // Rutas públicas de empresas (páginas informativas)
]

// Rutas protegidas por rol
const protectedRoutes = {
  '/superadmin': ['SUPER_ADMIN', 'ADMIN_ALIADO'],
  '/company': ['COMPANY'],
}

// Rutas API públicas
const publicApiRoutes = [
  '/api/auth',
  '/api/public',
  '/api/logout',
  '/api/company/slug', // API pública para obtener información de empresa por slug
  '/api/v1/users/create-admin', // API pública para crear el primer administrador
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Verificar si es una ruta pública de empresa (página informativa)
    // Las rutas /company/[slug] son públicas, pero /company/page, /company/settings, etc. requieren autenticación
    if (pathname.startsWith('/company/')) {
      // Si es una ruta de página pública de empresa (solo slug, sin subrutas protegidas)
      const companyPathMatch = pathname.match(/^\/company\/([^\/]+)$/)
      if (companyPathMatch) {
        // Es una ruta pública de empresa (ej: /company/tecnologias)
        return NextResponse.next()
      }
      // Si tiene subrutas como /company/page, /company/settings, etc., requiere autenticación
    } else {
      // Otras rutas públicas
      return NextResponse.next()
    }
  }

  // Permitir rutas API públicas
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar autenticación para rutas protegidas
  const token = request.cookies.get('auth_token')?.value
  const userStr = request.cookies.get('user')?.value

  // Si no hay token ni cookie de usuario, redirigir al login
  // EXCEPTO si estamos en la ruta de login (para evitar loops)
  if (!token && !userStr) {
    // Permitir acceso a la ruta de login sin token
    if (pathname === '/login') {
      return NextResponse.next()
    }
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'No autorizado', message: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }
    // Para otras rutas protegidas, redirigir al login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar rol para rutas específicas
  if (pathname.startsWith('/superadmin')) {
    // Si hay token o userStr, permitir acceso (el cliente verificará el rol desde localStorage)
    // Esto es necesario para evitar redirecciones infinitas después del login
    // El componente del cliente puede verificar el rol desde localStorage
    if (!token && !userStr) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'No autorizado', message: 'Token de autenticación requerido' },
          { status: 401 }
        )
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Si hay token o userStr, permitir acceso
  }

  // Verificar rutas protegidas de company (excluyendo rutas públicas como /company/[slug])
  // Las rutas /company/[slug] son públicas, pero /company/page, /company/settings, etc. requieren autenticación
  if (pathname.startsWith('/company/')) {
    // Verificar si es una ruta pública de empresa (solo slug, sin subrutas)
    const companyPathMatch = pathname.match(/^\/company\/([^\/]+)$/)
    if (!companyPathMatch) {
      // Es una ruta protegida de company (ej: /company/page, /company/settings)
      // Verificar autenticación primero
      if (!token && !userStr) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'No autorizado', message: 'Token de autenticación requerido' },
            { status: 401 }
          )
        }
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Si hay token o userStr, permitir acceso (el cliente verificará el rol desde localStorage)
      // Esto es necesario para evitar redirecciones infinitas después del login
      // El componente del cliente puede verificar el rol desde localStorage
    }
    // Si es una ruta pública de empresa (/company/[slug]), ya se permitió arriba
  }

  // Proteger rutas API que no son públicas
  if (pathname.startsWith('/api/') && !publicApiRoutes.some(route => pathname.startsWith(route))) {
    if (!token && !userStr) {
      return NextResponse.json(
        { error: 'No autorizado', message: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

