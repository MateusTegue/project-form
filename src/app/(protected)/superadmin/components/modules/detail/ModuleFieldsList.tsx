'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import ModuleFieldCard from './ModuleFieldCard';

interface ModuleFieldsListProps {
  fields: any[];
}

export default function ModuleFieldsList({ fields }: ModuleFieldsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Campos del Módulo</CardTitle>
              <CardDescription>
                Lista de campos configurados en este módulo
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary">
            {fields.length} campo{fields.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-muted-foreground">
              Este módulo no tiene campos configurados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <ModuleFieldCard key={field.id || index} field={field} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}