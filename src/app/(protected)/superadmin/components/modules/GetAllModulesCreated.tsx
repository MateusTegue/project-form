'use client';

import React from 'react';
import { useGetAllModules } from '../../hook/modules/useGetAllModules';
import ModulesHeader from './ModulesHeader';
import ModulesGrid from './ModulesGrid';
import ModulesEmpty from './ModulesEmpty';
import ModulesLoading from './ModulesLoading';
import ModulesError from './ModulesError';

export interface Module {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  created_at: string;
  fields?: any[];
}

export default function GetAllModulesCreated() {
  const { modules, loading, error, refetch } = useGetAllModules();

  if (loading) {
    return <ModulesLoading />;
  }

  if (modules.length === 0) {
    return <ModulesEmpty />;
  }

  if (error) {
    return <ModulesError error={error} onRetry={refetch} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <ModulesHeader 
        totalModules={modules.length}
        activeModules={modules.filter(m => m.isActive).length}
      />
      
      {modules.length === 0 ? (
        <ModulesEmpty />
      ) : (
        <ModulesGrid modules={modules} />
      )}
    </div>
  );
}