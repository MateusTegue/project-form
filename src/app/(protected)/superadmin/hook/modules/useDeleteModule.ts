import { useState } from "react";
import toast from "react-hot-toast";

export interface UseDeleteModuleReturn {
  deleteModule: (moduleId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useDeleteModule(): UseDeleteModuleReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteModule = async (moduleId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.message || "Error al eliminar el módulo";
        throw new Error(errorMessage);
      }

      toast.success("Módulo eliminado correctamente");
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error al eliminar el módulo";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteModule, isLoading, error };
}

