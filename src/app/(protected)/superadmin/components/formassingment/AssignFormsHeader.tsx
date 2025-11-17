'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AssignFormsHeaderProps } from '../../types/models';



export default function AssignFormsHeader({ availableCount, assignedCount }: AssignFormsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold flex items-center gap-2">Formularios</h3>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {availableCount} disponible{availableCount !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline">
          {assignedCount} asignado{assignedCount !== 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  );
}