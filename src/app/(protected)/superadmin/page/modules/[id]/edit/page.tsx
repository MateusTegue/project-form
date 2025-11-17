'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllModules } from '../../../../hook/modules/useGetAllModules';
import ModuleEditLoading from '@/app/(protected)/superadmin/components/modules/edit/ModuleEditLoading';
import ModuleEditError from '@/app/(protected)/superadmin/components/modules/edit/ModuleEditError';
import ModuleEditForm from '@/app/(protected)/superadmin/components/modules/edit/ModuleEditForm';

export default function ModuleEditPage() {
  const params = useParams();
  const moduleId = params.id as string;
  const { modules, loading, error, refetch } = useGetAllModules();
  const [currentModule, setCurrentModule] = useState<any>(null);

  useEffect(() => {
    if (modules.length > 0) {
      const module = modules.find(m => m.id === moduleId);
      setCurrentModule(module || null);
    }
  }, [modules, moduleId]);

  // Refrescar cuando cambie el módulo
  useEffect(() => {
    if (moduleId) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  if (loading) {
    return <ModuleEditLoading />;
  }

  if (error || !currentModule) {
    return <ModuleEditError message={error || "Módulo no encontrado"} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <ModuleEditForm module={currentModule} />
    </div>
  );
}