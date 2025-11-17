import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Submission } from '../../types/models';



export function useGetSubmissions(companyId: string, status?: string, search?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    fetchSubmissions();
  }, [companyId, status, search]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const url = `/api/submissions/company/${companyId}?${queryParams.toString()}`;
      
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error('Error al obtener submissions');
      }

      const response = await res.json();
      
      let filteredData = response.data || [];
      if (status) {
        filteredData = filteredData.filter((s: Submission) => s.status === status);
      }
      
      setSubmissions(filteredData);
    } catch (err: any) {
      setError(err.message);
      toast.error('Error al cargar formularios recibidos');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSubmissions();
  };

  return { submissions, loading, error, refetch };
}