'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FileText, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetFormTemplateById } from '../../../../hook/formtemplate/useGetFormTemplateById';
import SelectModulesForTemplate from '../../../../components/templates/SelectModulesForTemplate';
import { FormModule } from '@/types/models';
import FormTemplatesLoading from '../../../../components/templates/FormTemplatesLoading';
import FormTemplatesError from '../../../../components/templates/FormTemplatesError';

export default function EditFormTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const { template, loading, error } = useGetFormTemplateById(templateId);
  const [selectedModules, setSelectedModules] = useState<FormModule[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Inicializar módulos seleccionados desde el template
  useEffect(() => {
    if (template && template.moduleAssignments) {
      const initialModules: FormModule[] = template.moduleAssignments.map((assignment: any) => ({
        moduleId: assignment.module?.id || assignment.moduleId,
        name: assignment.module?.name || '',
        description: assignment.module?.description || '',
        moduleKey: assignment.module?.moduleKey || '',
        isActive: assignment.isActive ?? true,
        fields: assignment.module?.fields || [],
        displayOrder: assignment.displayOrder || 0,
        isRequired: assignment.isRequired ?? false
      }));
      setSelectedModules(initialModules);
    }
  }, [template]);

  const handleSave = async () => {
    if (selectedModules.length === 0) {
      toast.error('Debes seleccionar al menos un módulo');
      return;
    }

    setIsSaving(true);
    try {
      // Preparar los módulos para enviar
      const modulesToAdd = selectedModules.map((module, index) => ({
        moduleId: module.moduleId,
        displayOrder: index,
        isRequired: module.isRequired ?? false,
        isActive: module.isActive ?? true
      }));

      const response = await fetch(`/api/formtemplate/${templateId}/modules`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modules: modulesToAdd
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el formulario');
      }

      toast.success('Formulario actualizado exitosamente');
      router.push('/superadmin/page/formstemplates');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <FormTemplatesLoading />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto p-6">
        <FormTemplatesError error={error || 'Formulario no encontrado'} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/superadmin/page/formstemplates')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Editar Formulario
              </h1>
              <p className="text-muted-foreground mt-1">
                {template.name}
              </p>
            </div>
          </div>
        </div>

        {/* Información del Formulario */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Formulario
            </CardTitle>
            <CardDescription>
              Detalles generales del formulario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-base font-semibold">{template.name}</p>
            </div>
            {template.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                <p className="text-base">{template.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-base">{template.templateType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <p className="text-base">{template.status || 'Activo'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Selección de Módulos */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Módulos del Formulario
            </CardTitle>
            <CardDescription>
              Selecciona los módulos que formarán parte de este formulario. Puedes agregar o quitar módulos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SelectModulesForTemplate
              selectedModules={selectedModules}
              onModulesChange={setSelectedModules}
            />
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/superadmin/page/formstemplates')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || selectedModules.length === 0}
            className="min-w-[160px]"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

