'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllModules } from '../../../hook/modules/useGetAllModules';
import ModuleDetailHeader from '../../../components/modules/detail/ModuleDetailHeader';
import ModuleDetailInfo from '../../../components/modules/detail/ModuleDetailInfo';
import ModuleFieldsList from '../../../components/modules/detail/ModuleFieldsList';
import ModuleDetailLoading from '../../../components/modules/detail/ModuleDetailLoading';
import ModuleDetailError from '../../../components/modules/detail/ModuleDetailError';

export default function ModuleDetailPage() {
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
    return <ModuleDetailLoading />;
  }

  if (error || !currentModule) {
    return <ModuleDetailError message={error || "Módulo no encontrado"} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <ModuleDetailHeader module={currentModule} />
      
      <ModuleDetailInfo module={currentModule} />
      
      <ModuleFieldsList fields={currentModule.fields || []} />
    </div>
  );
}
