"use client";
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useEffect, useState } from 'react';

export function useAuthGuard(requiredRole?: string, redirectPath: string = '(public)/login') {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); 
  useEffect(() => {
    const user = authService.getCurrentUser();
    const userRole = authService.getUserRole();

    if (!user) {
      router.replace(redirectPath);
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      router.replace(redirectPath);
      return;
    }

    setIsAuthorized(true);
  }, [router, requiredRole, redirectPath]);

  return isAuthorized;
}