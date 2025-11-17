import { useState } from "react";
import toast from "react-hot-toast";

export function useActivateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateCompany = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/company/${id}/activate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.code === 200) {
        return true;
      } else {
        const errorMessage = data.message || "Error al activar empresa";
        setError(errorMessage);
        return false;
      }
      
    } catch (err: any) {
      const errorMessage = err.message || "Error de conexión al activar empresa";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activateCompany, loading, error };
}