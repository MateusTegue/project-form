'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAssignedTemplates } from '@/app/(protected)/superadmin/hook/formassingment/useGetAssignedTemplates';
import { useUnassignCompanyForms } from '@/app/(protected)/superadmin/hook/formassingment/useUnassignCompanyForms';
import AssignedTemplatesHeader from './AssignedTemplatesHeader';
import AssignedTemplatesGrid from './AssignedTemplatesGrid';
import AssignedTemplatesLoading from './AssignedTemplatesLoading';
import AssignedTemplatesError from './AssignedTemplatesError';
import AssignedTemplatesEmpty from './AssignedTemplatesEmpty';
import { AssignedTemplatesListProps } from '@/types/models';
import toast from 'react-hot-toast';

export default function AssignedTemplatesList({ 
  companyId, 
  companyName 
}: AssignedTemplatesListProps) {
  const { assignments, loading, error, refetch } = useGetAssignedTemplates(companyId);
  const { unassignCompanyForms, loading: unassigning } = useUnassignCompanyForms();

  const handleRemoveAssignment = async (
    assignmentId: string, 
    templateName: string
  ) => {
    if (!confirm(`¿Deseas desasignar "${templateName}" de ${companyName}?`)) {
      return;
    }

    try {
      await unassignCompanyForms(assignmentId);
      toast.success('Formulario desasignado correctamente');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Error al desasignar formulario');
    }
  };

  if (loading) {
    return <AssignedTemplatesLoading />;
  }

  if (error) {
    return <AssignedTemplatesError error={error} onRetry={refetch} />;
  }

  if (assignments.length === 0) {
    return <AssignedTemplatesEmpty companyName={companyName} />;
  }

  return (
    <div className="space-y-4">
      <AssignedTemplatesHeader 
        companyName={companyName}
        totalAssignments={assignments.length}
      />

      <ScrollArea className="h-[70vh] w-full">
        <AssignedTemplatesGrid 
          assignments={assignments}
          onRemove={handleRemoveAssignment}
          unassigning={unassigning}
        />
      </ScrollArea>
    </div>
  );
}