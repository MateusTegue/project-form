import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface SubmissionStats {
  total: number;
  pendiente: number;
  procesando: number;
  procesado: number;
}

export function useGetSubmissionStats(companyId: string) {
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pendiente: 0,
    procesando: 0,
    procesado: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || companyId === 'undefined') {
      setLoading(false);
      return;
    }

    fetchStats();
  }, [companyId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const url = `/api/submissions/company/${companyId}/stats`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const response = await res.json();
      
      const data = response.data || {
        total: 0,
        pendiente: 0,
        procesando: 0,
        procesado: 0,
      };
      
      // Asegurar que todos los valores sean números
      const processedData = {
        total: Number(data.total) || 0,
        pendiente: Number(data.pendiente) || 0,
        procesando: Number(data.procesando) || 0,
        procesado: Number(data.procesado) || 0,
      };
      
      setStats(processedData);
    } catch (err: any) {
      setError(err.message);
      toast.error('Error al cargar estadísticas');
      setStats({
        total: 0,
        pendiente: 0,
        procesando: 0,
        procesado: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStats();
  };

  return { stats, loading, error, refetch };
}

