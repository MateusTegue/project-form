'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Layers, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import FieldBuilder from '../../form-builder/FieldBuilder';

interface ModuleFieldsCardProps {
  form: UseFormReturn<any>;
  fields: any[];
  onFieldsChange: (fields: any[]) => void;
}

export default function ModuleFieldsCard({ form, fields, onFieldsChange }: ModuleFieldsCardProps) {
  const moduleKey = form.watch('moduleKey');
  
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Campos del Módulo
          {fields.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {fields.length} campo{fields.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Agrega los campos que formarán parte de este módulo. Puedes reordenarlos arrastrándolos.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FieldBuilder fields={fields} onFieldsChange={onFieldsChange} moduleKey={moduleKey} />

        {form.formState.errors.fields && typeof form.formState.errors.fields.message === 'string' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.fields.message}
            </AlertDescription>
          </Alert>
        )}

        {fields.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Agrega al menos un campo para poder guardar el módulo
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}