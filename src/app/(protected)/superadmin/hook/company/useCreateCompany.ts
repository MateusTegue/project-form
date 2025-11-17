import { useEffect, useState } from "react";
import { z } from "zod";
import { createCompanySchema } from "@/lib/validations";
import toast from "react-hot-toast";
import { authService } from "@/lib/auth";
import { CreateCompanyResponse } from "@/types/models";

export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  
  const createCompany = async (
    values: z.infer<typeof createCompanySchema>
  ): Promise<CreateCompanyResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new Error(
          "No hay usuario autenticado. Por favor inicia sesión nuevamente."
        );
      }

      const requestData = {
        ...values,
        createdBy: currentUser.id,
      };

      const res = await fetch("/api/company", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Error desconocido al crear empresa"
        );
      }

      toast.success("Empresa creada correctamente");
      setData(responseData.data);
      return { success: true, data: responseData.data };
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear empresa";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createCompany, isLoading, error, data };
}
