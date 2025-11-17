import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { authService } from '@/lib/auth';
import { updateProfileSchema, type UpdateProfileSchema } from '@/lib/validations';
import { User } from '@/types/models';

interface UseSuperAdminProfileEditReturn {
  formData: Partial<User>;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: ReturnType<typeof useForm<UpdateProfileSchema>>['register'];
  formState: ReturnType<typeof useForm<UpdateProfileSchema>>['formState'];
  control: ReturnType<typeof useForm<UpdateProfileSchema>>['control'];
  reset: ReturnType<typeof useForm<UpdateProfileSchema>>['reset'];
  setValue: ReturnType<typeof useForm<UpdateProfileSchema>>['setValue'];
  watch: ReturnType<typeof useForm<UpdateProfileSchema>>['watch'];
  getValues: ReturnType<typeof useForm<UpdateProfileSchema>>['getValues'];
}

export function useSuperAdminProfileEdit(): UseSuperAdminProfileEditReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<User>>({});

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      secondName: '',
      firstMiddleName: '',
      secondMiddleName: '',
      email: '',
      codePhone: '+57',
      phone: '',
      username: '',
    },
  });

  // Cargar datos del usuario actual al montar el componente
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && Object.keys(initialData).length === 0) {
      const formData: Partial<UpdateProfileSchema> = {
        firstName: user.firstName || '',
        secondName: user.secondName || null,
        firstMiddleName: user.firstMiddleName || '',
        secondMiddleName: user.secondMiddleName || null,
        email: user.email || '',
        codePhone: user.codePhone || '+57',
        phone: user.phone || '',
        username: user.username || '',
      };

      setInitialData(formData);
      form.reset(formData);
    }
  }, []);

  // Función para actualizar el perfil
  const onSubmit = async (data: UpdateProfileSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener token del localStorage (fallback si no hay cookie)
      const token = localStorage.getItem('token');
      
      // Preparar los datos para enviar (solo campos que han cambiado)
      const updateData: Partial<UpdateProfileSchema> = {};
      
      (Object.keys(data) as Array<keyof UpdateProfileSchema>).forEach((key) => {
        const currentValue = data[key];
        const initialValue = initialData[key as keyof typeof initialData];
        
        // Comparar valores considerando null y undefined
        if (currentValue !== undefined && currentValue !== initialValue) {
          // Los campos secondName y secondMiddleName pueden ser null según el schema
          if (key === 'secondName' || key === 'secondMiddleName') {
            updateData[key] = currentValue as string | null | undefined;
          } else {
            updateData[key] = currentValue as string | undefined;
          }
        }
      });

      // Si no hay cambios, no hacer la petición
      if (Object.keys(updateData).length === 0) {
        toast('No hay cambios para guardar', { icon: 'ℹ️' });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        
        // Manejar error de conexión
        if (response.status === 503) {
          throw new Error(
            responseData.message || 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.'
          );
        }
        
        throw new Error(
          responseData.message || responseData.error || 'Error al actualizar el perfil'
        );
      }

      const responseData = await response.json();

      // Actualizar localStorage con los nuevos datos
      const currentUser = authService.getCurrentUser();
      if (currentUser && responseData.data) {
        const updatedUser = {
          ...currentUser,
          ...responseData.data,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Actualizar los datos iniciales
      setInitialData({ ...initialData, ...updateData });
      
      toast.success('Perfil actualizado correctamente');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener los valores actuales del formulario
  const formData = form.watch();

  return {
    formData: {
      ...initialData,
      ...formData,
    },
    isLoading,
    error,
    handleSubmit: form.handleSubmit(onSubmit),
    register: form.register,
    formState: form.formState,
    control: form.control,
    reset: form.reset,
    setValue: form.setValue,
    watch: form.watch,
    getValues: form.getValues,
  };
}

