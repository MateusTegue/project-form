'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Combobox } from '@/components/ui/combobox';
import { getModuleOptions, getModuleByKey } from '@/utils/modulesAndFieldsData';

interface ModuleBasicInfoCardProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  canProceed: boolean;
}

export default function ModuleBasicInfoCard({ form, onNext, canProceed }: ModuleBasicInfoCardProps) {
  const watchModuleKey = form.watch('moduleKey');
  
  // Obtener opciones de módulos predefinidos
  const moduleOptions = useMemo(() => {
    try {
      const options = getModuleOptions();
      return options;
    } catch (error) {
      return [];
    }
  }, []);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Información Básica
        </CardTitle>
        <CardDescription>
          Define los datos generales del módulo. Los módulos son reutilizables y pueden asociarse a múltiples formularios.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Módulo *</FormLabel>
              <FormControl>
                <Combobox
                  options={moduleOptions}
                  value={watchModuleKey || ""}
                  onValueChange={(moduleKey) => {
                    if (moduleKey) {
                      const selectedModule = getModuleByKey(moduleKey);
                      if (selectedModule) {
                        form.setValue('name', selectedModule.name);
                        form.setValue('moduleKey', selectedModule.moduleKey);
                        form.setValue('description', selectedModule.description || "");
                      }
                    }
                  }}
                  placeholder="Buscar o seleccionar módulo predefinido..."
                  searchPlaceholder="Buscar módulo..."
                  emptyMessage="No se encontraron módulos predefinidos."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {watchModuleKey && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <span className="text-xs">
                Clave generada: <Badge variant="secondary" className="ml-1">{watchModuleKey}</Badge>
              </span>
            </AlertDescription>
          </Alert>
        )} */}
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el propósito de este módulo..."
                  className="resize-none text-base"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-slate-50 border-t">
        <p className="text-sm text-muted-foreground">
          Completa estos datos para continuar
        </p>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2"
        >
          Siguiente: Agregar Campos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}