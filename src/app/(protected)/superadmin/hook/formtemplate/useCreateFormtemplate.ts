import { useEffect, useState } from "react";
import { z } from "zod";
import { createFormtemplateSchema } from "../../schemas/formtemplate";
import toast from "react-hot-toast";
import { authService } from "@/lib/auth";
import { CreateFormtemplateResponse } from "@/types/models";

export function useCreateFormtemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const createFormtemplate = async (
    values: z.infer<typeof createFormtemplateSchema>
  ): Promise<CreateFormtemplateResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new Error(
          "No hay usuario autenticado. Por favor inicia sesión nuevamente."
        );
      }

      const transformedModules = values.modules.map((module: any) => {

        return {
          moduleId: module.moduleId || module.id,
          displayOrder: module.displayOrder ?? 0,
          isRequired: module.isRequired ?? true,
          isActive: module.isActive ?? true,
        };
      });


      const requestData = {
        name: values.name,
        description: values.description,
        templateType: values.templateType,
        createdBy: currentUser.id,
        modules: transformedModules,
      };

      const res = await fetch("/api/formtemplate", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Error desconocido al crear el formulario"
        );
      }

      toast.success("Formulario creado correctamente");
      setData(responseData.data);
      return { success: true, data: responseData.data };
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear el formulario";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createFormtemplate, isLoading, error, data };
}
