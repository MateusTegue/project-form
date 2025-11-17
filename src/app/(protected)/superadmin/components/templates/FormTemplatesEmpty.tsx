'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function FormTemplatesEmpty() {
  return (
    <Card className="h[20px] border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 ">
          No hay formularios disponibles
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Crea tu primer formulario para comenzar a gestionar tus procesos.
        </p>
      </CardContent>
    </Card>
  );
}

