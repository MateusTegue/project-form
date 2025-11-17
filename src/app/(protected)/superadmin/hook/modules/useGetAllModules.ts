import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Module {
  id: string;
  name: string;
  description?: string;
  moduleKey: string;
  isActive: boolean;
  fields: any[];
  created_at: string;
  updated_at: string;
}

interface BackendResponse {
  data: Module[];
  code: number;
  success: boolean;
  message: string;
  errors: any[];
}

export function useGetAllModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/modules", {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error("Error al obtener módulos");
      }

      const response: BackendResponse = await res.json();
      
      if (Array.isArray(response.data)) {
        setModules(response.data);
      } else if (Array.isArray(response)) {
        setModules(response);
      } else {
        setModules([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error al cargar módulos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return {
    modules,
    loading,
    error,
    refetch: fetchModules
  };
}