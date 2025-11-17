'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileX, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssignedFormEmptyProps } from '../../types/models';


const AssignedFormEmpty: React.FC<AssignedFormEmptyProps> = ({ companyName }) => {
  return (
    <div className="p-6">
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <FileX className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No hay formularios activados
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {companyName 
              ? `Aún no se han activado formularios para ${companyName}.` 
              : 'Asigna formularios para comenzar a recibir información.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignedFormEmpty;