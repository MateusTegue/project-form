'use client';

import React from 'react';
import AssignFormCard from './AssignFormCard';
import { AssignFormsGridProps } from '../../types/models';

export default function AssignFormsGrid({ templates, onAssign }: AssignFormsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <AssignFormCard 
          key={template.id} 
          template={template}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}