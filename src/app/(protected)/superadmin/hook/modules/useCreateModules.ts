import { useState } from "react";
import { z } from "zod";
import { createModuleSchema } from "../../schemas/createSchemas";
import toast from "react-hot-toast";

export interface CreateModuleResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function useCreateModule() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const createModule = async (
    values: z.infer<typeof createModuleSchema>
  ): Promise<CreateModuleResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Error desconocido al crear módulo"
        );
      }

      toast.success("Módulo creado correctamente");
      setData(responseData.data);
      return { success: true, data: responseData.data };
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear módulo";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createModule,
    isLoading,
    error,
    data,
  };
}