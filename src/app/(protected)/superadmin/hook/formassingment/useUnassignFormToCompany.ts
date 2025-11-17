import { useState } from "react";
import toast from "react-hot-toast";

export function useUnassignFormToCompany() {
  const [loading, setLoading] = useState(false);

  const unassignForm = async (companyId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companyassing/${companyId}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al desasignar el formulario");
      }

      toast.success("Formulario desasignado correctamente");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error al desasignar formulario");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { unassignForm, loading };
}
