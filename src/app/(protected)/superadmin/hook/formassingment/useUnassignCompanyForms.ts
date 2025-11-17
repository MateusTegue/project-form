import { useState } from 'react';

export function useUnassignCompanyForms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const unassignCompanyForms = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`/api/formassingment/${assignmentId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.errors?.[0] || errorData.error || response.statusText);
      }
      
      const data = await response.json();
      
      if (data?.success) setSuccess(true);

      return data;
    } catch (err: any) {
      setError(err.message || 'Error al desasignar el formulario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { unassignCompanyForms, loading, success, error };
}