import { useState } from "react";


export function useDeleteCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCompany = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/company/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error || "Error al eliminar la empresa");
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setLoading(false);
      return false;
    }
  };

  return { deleteCompany, loading, error };
}

