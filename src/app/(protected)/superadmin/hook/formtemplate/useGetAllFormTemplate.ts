import { useEffect, useState } from "react";

export function useGetAllFormTemplate() {
    const [formtemplates, setFormtemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetch("/api/formtemplate", {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener formtemplates");
          return res.json();
        })
        .then((response) => {
          // La API devuelve { data: [...], success: true, ... }
          const templates = Array.isArray(response.data) ? response.data : [];
          setFormtemplates(templates);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, []);

    return ({
        formtemplates,
        loading,
        error
    })
}