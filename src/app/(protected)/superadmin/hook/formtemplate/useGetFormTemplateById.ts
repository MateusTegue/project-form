import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  templateType: string;
  status: string;
  modules: any[];
  created_at: string;
  updated_at: string;
}

interface BackendResponse {
  id: string;
  data: FormTemplate;
  code: number;
  success: boolean;
  message: string;
  errors: any[];
}

export function useGetFormTemplateById(id: string) {
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/formtemplate/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el formulario");
        return res.json();
      })
      .then((response: BackendResponse) => {
        if (response.data) {
          setTemplate(response.data);
        } else if (response.id) {
          setTemplate(response as any);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        toast.error("Error al cargar el formulario");
        setLoading(false);
      });
  }, [id]);

  return {
    template,
    loading,
    error,
  };
}