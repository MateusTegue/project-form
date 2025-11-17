'use client';

import React from 'react';
import AssignedTemplateCard from './AssignedTemplateCard';

interface AssignedTemplatesGridProps {
  assignments: any[];
  onRemove: (assignmentId: string, templateName: string) => void;
  unassigning: boolean;
}

export default function AssignedTemplatesGrid({ 
  assignments, 
  onRemove, 
  unassigning 
}: AssignedTemplatesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-1">
      {assignments.map((assignment) => (
        <AssignedTemplateCard
          key={assignment.id}
          assignment={assignment}
          onRemove={onRemove}
          unassigning={unassigning}
        />
      ))}
    </div>
  );
}