import { useState, useEffect } from 'react';
import { Role } from '@/types/models';


export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch('/api/role');
        if (!res.ok) throw new Error('Error al cargar roles');
        const responseData = await res.json();
        
        if (responseData.data && Array.isArray(responseData.data)) {
          setRoles(responseData.data);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setRoles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return { roles, loading, error };
}