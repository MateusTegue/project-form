'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import FormsHeader from './FormsHeader';
import CompanyFormsContent from './CompanyFormsContent';
import CompanyFormsLoading from './CompanyFormsLoading';
import CompanyFormsError from './CompanyFormsError';

interface CompanyData {
  id: string;
  name: string;
}

export default function CompanyFormsContainer() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      
      if (!user) {
        setError('No se encontró sesión activa');
        setLoading(false);
        return;
      }

      const companyId = user.id; 
      const companyName = user.name;

      if (!companyId) {
        setError('No se encontró información de la empresa');
        setLoading(false);
        return;
      }

      setCompanyData({
        id: companyId,
        name: companyName
      });
    } catch (err: any) {
      setError('Error al cargar información de la empresa');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <CompanyFormsLoading />;
  }

  if (error || !companyData) {
    return <CompanyFormsError error={error} />;
  }

  return (
    <div className="w-full min-h-screen">
      <FormsHeader 
        companyId={companyData.id}
      />
      
      <CompanyFormsContent 
        companyId={companyData.id}
        companyName={companyData.name}
      />
    </div>
  );
}