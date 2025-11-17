import { useEffect, useState } from "react";


export function useFormTemplateCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/formtemplate/count', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        // Asegurar que extraemos el número correctamente
        const countValue = typeof response.data === 'number' 
          ? response.data 
          : (response.data?.count ?? response.count ?? 0);
        setCount(countValue);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { count, loading, error };
}
