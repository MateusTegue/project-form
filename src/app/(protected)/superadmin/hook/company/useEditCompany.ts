import { useState, useEffect } from "react";

interface Company {
  id: string;
  name: string;
  nit: string;
  razonSocial: string;
  country: string;
  city: string;
  address: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactPhoneCountryCode: string;
  contactFirstName: string;
  contactLastName: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UseCompanyReturn {
  company: Company | null;
  loading: boolean;
  error: string | null;
  updateCompany: (data: Partial<Company>) => Promise<boolean>;
}

export function useCompany(id: string): UseCompanyReturn {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener compañía por ID
  useEffect(() => {
    if (!id) {
      setError("ID no proporcionado");
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/company/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error ${res.status}`);
        }
        
        const json = await res.json();
        
        const companyData = json.data?.data || json.data;
                
        if (companyData) {
          setCompany(companyData);
        } else {
          throw new Error("Datos de compañía no encontrados en la respuesta");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Actualizar compañía
  const updateCompany = async (data: Partial<Company>): Promise<boolean> => {
    try {
      setError(null);
  
      const res = await fetch(`/api/company/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.error || `Error ${res.status}`);
      }
      
      setCompany(prev => prev ? { ...prev, ...data } : null);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    company,
    loading,
    error,
    updateCompany
  };
}