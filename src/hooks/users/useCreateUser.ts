import { useState } from "react";
import { z } from "zod";
import { createUserSchema } from "@/lib/validations";
import toast from "react-hot-toast";
import { CreateUserResponse } from "@/types/models";

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const createUser = async (
    values: z.infer<typeof createUserSchema>
  ): Promise<CreateUserResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...values,
        secondName: values.secondName || undefined,
        secondMiddleName: values.secondMiddleName || undefined,
      };

      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await res.json();

        if (!res.ok) {
        const backendError =
          responseData?.error ||
          responseData?.data?.cause ||
          "Error desconocido al crear usuario";

        throw new Error(backendError);
      }

      toast.success("Usuario creado correctamente");

      setData(responseData);
      return { success: true, data: responseData };
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";

      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };

        } finally {
          setIsLoading(false);
        }
  };

  return {
    createUser,
    isLoading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}
