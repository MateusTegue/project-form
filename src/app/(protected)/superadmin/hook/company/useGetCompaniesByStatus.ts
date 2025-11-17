import { useEffect, useState } from "react";

export function useGetCompaniesByStatus(status: string | null) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Limpiar error anterior
    
    const endpoint = status === "INACTIVO" 
      ? "/api/company/status"  
      : "/api/company";      

    fetch(endpoint, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        // Si la respuesta no es ok, verificar si es un error real o solo no hay datos
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          // Solo lanzar error si es un error real del servidor (500, 401, 403, etc.)
          // No lanzar error si es simplemente que no hay datos
          if (res.status >= 500 || res.status === 401 || res.status === 403) {
            throw new Error(errorData.error || "Error al obtener empresas");
          }
          // Si es otro tipo de error, devolver array vacío en lugar de error
          return { data: [] };
        }
        return res.json();
      })
      .then((data) => {
        // Extraer el array de empresas de diferentes formatos de respuesta
        let list: any[] = [];
        
        if (data) {
          if (Array.isArray(data.data)) {
            list = data.data;
          } else if (Array.isArray(data)) {
            list = data;
          } else if (data.result && Array.isArray(data.result.data)) {
            list = data.result.data;
          } else if (data.result && Array.isArray(data.result)) {
            list = data.result;
          }
        }
        
        setCompanies(list);
        setError(null); // Asegurar que no hay error cuando hay datos (aunque sea array vacío)
        setLoading(false);
      })
      .catch((err) => {
        // Solo establecer error si es un error real, no si es simplemente que no hay datos
        if (err.message && !err.message.includes("No hay")) {
          setError(err.message);
        } else {
          setError(null);
          setCompanies([]); // Establecer array vacío en lugar de error
        }
        setLoading(false);
      });
  }, [status]);
  
  return { companies, loading, error };
}