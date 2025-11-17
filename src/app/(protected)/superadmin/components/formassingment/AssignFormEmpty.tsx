'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AssignFormEmptyProps } from '../../types/models';



export default function AssignFormEmpty({ companyName, totalTemplates, assignedCount }: AssignFormEmptyProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {totalTemplates > 0 
            ? 'Todos los formularios asignados' 
            : 'No hay formularios disponibles'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {totalTemplates > 0 
            ? `Todos los formularios disponibles ya están asignados a ${companyName}` 
            : 'No hay formularios disponibles para asignar en este momento'}
        </p>
        {assignedCount > 0 && (
          <Alert className="max-w-md">
            <AlertDescription>
              <strong>{assignedCount}</strong> formulario{assignedCount !== 1 ? 's' : ''} ya asignado{assignedCount !== 1 ? 's' : ''}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}