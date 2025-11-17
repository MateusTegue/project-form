'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicFormModule from './PublicFormModule';
import PublicFormSubmitButton from './PublicFormSubmitButton';
import PublicFormSubmitterInfo from './PublicFormSubmitterInfo';
import { PublicFormFieldsProps } from '../../types/models';
import { getModuleOrder } from '@/utils/modulesAndFieldsData';


export default function PublicFormFields({
  assignment,
  formData,
  onInputChange,
  onSubmit,
  submitting
}: PublicFormFieldsProps) {
  const moduleAssignments = assignment.formTemplate?.moduleAssignments || [];
  
  // Ordenar módulos según el orden del JSON
  const modules = useMemo(() => {
    const moduleOrder = getModuleOrder();
    
    return [...moduleAssignments].sort((a: any, b: any) => {
      const orderA = moduleOrder.get(a.module?.moduleKey || '') ?? 999;
      const orderB = moduleOrder.get(b.module?.moduleKey || '') ?? 999;
      return orderA - orderB;
    });
  }, [moduleAssignments]);

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Sección Remitente */}
        <PublicFormSubmitterInfo
          formData={formData}
          onInputChange={onInputChange}
        />

        {/* Módulos del formulario */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Información del solicitante</CardTitle>
            <CardDescription>
              Complete todos los campos obligatorios marcados con <span className="text-destructive">(*)</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay campos disponibles en este formulario
              </div>
            ) : (
              modules.map((moduleAssignment: any, index: number) => (
                <React.Fragment key={moduleAssignment.id}>
                  {index > 0 && <Separator />}
                  <PublicFormModule
                    module={moduleAssignment.module}
                    isRequired={moduleAssignment.isRequired}
                    formData={formData}
                    onInputChange={onInputChange}
                  />
                </React.Fragment>
              ))
            )}

            <Separator className="my-6" />

            <PublicFormSubmitButton submitting={submitting} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}