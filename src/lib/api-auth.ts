import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  identifier?: string;
  role: string | { name: string };
  type?: string;
}

/**
 * Obtiene el token de autenticación desde cookies o headers
 */
export function getAuthToken(request: NextRequest): string | null {
  // Intentar obtener de cookies
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Intentar obtener del header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return token;
  }

  // Si no hay auth_token, intentar obtener de la cookie 'user' como alternativa
  // Esto es necesario porque después del login, la cookie 'user' puede estar disponible antes que 'auth_token'
  const userCookie = request.cookies.get('user')?.value;
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      // Si la cookie user tiene un token, usarlo (aunque normalmente no debería tenerlo)
      // En este caso, necesitamos obtener el token de otra forma
      // Por ahora, retornamos null y dejamos que requireAuth maneje el caso
    } catch (error) {
      // Error al parsear la cookie user
    }
  }

  return null;
}

/**
 * Verifica y decodifica el token JWT
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as AuthUser;

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded;
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
    } else if (error instanceof jwt.TokenExpiredError) {
    } else if (error instanceof jwt.NotBeforeError) {
    } else {
    }
    return null;
  }
}

/**
 * Obtiene el rol del usuario desde el token
 */
export function getUserRole(user: AuthUser | null): string | null {
  if (!user) return null;

  if (typeof user.role === 'string') {
    return user.role;
  }

  if (user.role && typeof user.role === 'object' && 'name' in user.role) {
    return user.role.name;
  }

  return null;
}

/**
 * Verifica si el usuario está autenticado
 */
export function requireAuth(request: NextRequest): { user: AuthUser; token: string } | NextResponse {
  const token = getAuthToken(request);
  const userCookie = request.cookies.get('user')?.value;

  // Si hay token, verificar y usar
  if (token) {
    const user = verifyToken(token);
    if (user) {
      return { user, token };
    }
  }

  // Si no hay token válido pero hay cookie 'user', intentar usarla como alternativa
  // Esto es necesario porque después del login, la cookie 'user' puede estar disponible antes que 'auth_token'
  // Sin embargo, necesitamos el token para hacer peticiones al backend
  // Por ahora, si no hay token, devolver error
  // El token debe estar disponible en las cookies después del login

  // Si no hay token ni cookie user, devolver error
  return NextResponse.json(
    {
      error: 'No autorizado',
      message: 'Token de autenticación requerido',
    },
    { status: 401 }
  );
}

/**
 * Verifica si el usuario tiene uno de los roles permitidos
 */
export function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): { user: AuthUser; token: string } | NextResponse {
  const authResult = requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const userRole = getUserRole(user);

  if (!userRole) {
    return NextResponse.json(
      {
        error: 'No autorizado',
        message: 'Rol de usuario no válido',
      },
      { status: 401 }
    );
  }

  // SUPER_ADMIN tiene acceso a todo
  if (userRole === 'SUPER_ADMIN') {
    return authResult;
  }

  // Verificar si el rol está permitido
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return NextResponse.json(
      {
        error: 'Acceso denegado',
        message: `No tienes permisos para acceder a este recurso. Rol requerido: ${allowedRoles.join(' o ')}`,
      },
      { status: 403 }
    );
  }

  return authResult;
}

/**
 * Helper para obtener headers con autenticación
 */
export function getAuthHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Cookie: `auth_token=${token}`,
    Authorization: `Bearer ${token}`,
  };
}

