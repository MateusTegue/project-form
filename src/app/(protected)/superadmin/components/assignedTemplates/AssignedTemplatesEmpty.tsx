'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssignedTemplatesEmptyProps {
  companyName: string;
}

export default function AssignedTemplatesEmpty({ companyName }: AssignedTemplatesEmptyProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              No hay formularios asignados
            </h3>
            <p className="text-muted-foreground max-w-sm">
              No hay formularios asignados a <strong>{companyName}</strong>
            </p>
          </div>

          <Alert className="max-w-md mt-4">
            <ArrowRight className="h-4 w-4" />
            <AlertDescription>
              Selecciona formularios disponibles en la sección superior para asignarlos
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}