"use client";

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

interface CurrentUser {
  id: string;
  companyId?: string;
  name?: string;
  email?: string;
  role?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        setError('Usuario no autenticado');
        setUser(null);
      } else {
        setUser(currentUser);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
}