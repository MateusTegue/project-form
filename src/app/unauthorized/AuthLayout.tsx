"use client";
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useEffect, useState } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectPath?: string;
}

export default function AuthLayout({  children,  requiredRole,  redirectPath = '/' }: AuthLayoutProps) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const user = authService.getCurrentUser();
    const userRole = authService.getUserRole();
    if (!user) {
      router.replace(redirectPath);
      setAuthStatus('unauthorized');
      return;
    }
    if (!requiredRole) {
      setAuthStatus('authorized');
      return;
    }

    // SUPER_ADMIN tiene acceso a todo
    if (userRole === 'SUPER_ADMIN') {
      setAuthStatus('authorized');
      return;
    }

    // ADMIN_ALIADO puede acceder a rutas de SUPER_ADMIN
    if (userRole === 'ADMIN_ALIADO' && requiredRole === 'SUPER_ADMIN') {
      setAuthStatus('authorized');
      return;
    }

    if (userRole === 'COMPANY' && requiredRole === 'COMPANY') {
      setAuthStatus('authorized');
      return;
    }

    if (userRole !== requiredRole) {
      router.replace(redirectPath);
      setAuthStatus('unauthorized');
      return;
    }
    setAuthStatus('authorized');
  }, [router, requiredRole, redirectPath]);

  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (authStatus === 'unauthorized') {
    return null;
  }

  return <>{children}</>;
}
