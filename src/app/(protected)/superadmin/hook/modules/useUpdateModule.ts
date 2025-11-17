import { useState } from "react";
import toast from "react-hot-toast";
import { FormField } from "@/types/models";

export interface UpdateModuleData {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  fields?: FormField[];
}

export interface UseUpdateModuleReturn {
  updateModule: (moduleId: string, data: UpdateModuleData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateModule(): UseUpdateModuleReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateModule = async (moduleId: string, data: UpdateModuleData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.message || responseData.details?.message || "Error al actualizar el módulo";
        throw new Error(errorMessage);
      }

      toast.success("Módulo actualizado correctamente");
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error al actualizar el módulo";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateModule, isLoading, error };
}

