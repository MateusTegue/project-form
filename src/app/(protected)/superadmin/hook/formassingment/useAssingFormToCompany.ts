import { useState } from 'react';
import { AssignFormInput } from '@/types/models';
import toast from 'react-hot-toast';



export function useAssignFormToCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignForm = async (data: AssignFormInput) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/formassingment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || 'Error al asignar el formulario');
      }

      toast.success('Formulario asignado exitosamente');
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMsg = err.message || 'Error al asignar el formulario';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { assignForm, loading, error };
}