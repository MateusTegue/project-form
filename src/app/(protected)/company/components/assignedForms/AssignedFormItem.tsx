'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGetFormAssignedToCompany } from '../../hook/getFormAssignedToCompany/useGetFormAssigned';
import AssignedFormCard from './AssignedFormCard';
import AssignedFormEmpty from './AssignedFormEmpty';
import AssignedFormError from './AssignedFormError';
import AssignedFormSkeleton from './AssignedFormSkeleton';
import { AssignedFormItemProps } from '../../types/models';


const AssignedFormItem: React.FC<AssignedFormItemProps> = ({ companyId, companyName }) => {
  const { assignments, loading, error } = useGetFormAssignedToCompany(companyId);

  if (loading) {
    return <AssignedFormSkeleton />;
  }

  if (error) {
    return <AssignedFormError error={error} />;
  }

  if (!assignments || assignments.length === 0) {
    return <AssignedFormEmpty companyName={companyName} />;
  }

  return (
    <div className="p-6">
      <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {assignments.map((assignment) => (
          <AssignedFormCard 
            key={assignment.assignmentId || assignment.id} 
            assignment={assignment} 
          />
        ))}
      </div>
    </div>
  );
};

export default AssignedFormItem;