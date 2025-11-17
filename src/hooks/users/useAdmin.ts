"use client";
import { useEffect, useState } from "react";

export function useAdmin() {
  const [admin, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then((data) => {
        // 🔍 Ajuste aquí:
        const adminsArray = Array.isArray(data) ? data : data.data || [];
        setAdmins(adminsArray);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { admin, loading, error };
}
