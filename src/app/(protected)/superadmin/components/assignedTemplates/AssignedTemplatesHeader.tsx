'use client';

import React from 'react';
import { FileCheck, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignedTemplatesHeaderProps {
  companyName: string;
  totalAssignments: number;
}

export default function AssignedTemplatesHeader({ 
  companyName, 
  totalAssignments 
}: AssignedTemplatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileCheck className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Formularios Asignados
            <Badge variant="secondary">
              {totalAssignments}
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {companyName}
          </p>
        </div>
      </div>
    </div>
  );
}