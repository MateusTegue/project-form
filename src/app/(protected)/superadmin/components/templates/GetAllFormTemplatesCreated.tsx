'use client';

import React from 'react';
import { useGetAllFormTemplate } from '../../hook/formtemplate/useGetAllFormTemplate';
import FormTemplatesHeader from './FormTemplatesHeader';
import FormTemplatesGrid from './FormTemplatesGrid';
import FormTemplatesEmpty from './FormTemplatesEmpty';
import FormTemplatesLoading from './FormTemplatesLoading';
import FormTemplatesError from './FormTemplatesError';

export default function GetAllFormTemplatesCreated() {
  const { formtemplates, loading, error } = useGetAllFormTemplate();

  if (loading) {
    return <FormTemplatesLoading />;
  }

  if (error) {
    return <FormTemplatesError error={error} />;
  }

  // Asegurar que formtemplates sea un array
  const templatesArray = Array.isArray(formtemplates) ? formtemplates : [];

  if (templatesArray.length === 0) {
    return <FormTemplatesEmpty />;
  }

  const activeTemplates = templatesArray.filter((t: any) => t.status === 'Activo' || !t.status).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <FormTemplatesHeader 
        totalTemplates={templatesArray.length}
        activeTemplates={activeTemplates}
      />
      
      {templatesArray.length === 0 ? (
        <FormTemplatesEmpty />
      ) : (
        <FormTemplatesGrid templates={templatesArray} />
      )}
    </div>
  );
}


