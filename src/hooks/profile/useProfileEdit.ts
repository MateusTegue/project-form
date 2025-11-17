import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '@/lib/auth';

interface UseProfileEditProps {
  userType: 'SUPER_ADMIN' | 'COMPANY';
}

export function useProfileEdit({ userType }: UseProfileEditProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setFormData(user);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const currentUser = authService.getCurrentUser();
      
      const endpoint = userType === 'COMPANY' 
        ? `/api/company/${currentUser?.id}` 
        : '/api/profile';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Perfil actualizado correctamente');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSave,
    setFormData
  };
}