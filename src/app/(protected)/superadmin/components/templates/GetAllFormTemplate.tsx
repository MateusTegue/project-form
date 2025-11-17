'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Layers, ArrowRight, Loader2, Check } from 'lucide-react';
import { useGetAllFormTemplate } from '../../hook/formtemplate/useGetAllFormTemplate';
import { useAssignFormToCompany } from '../../hook/formassingment/useAssingFormToCompany';
import { useUnassignFormToCompany } from '../../hook/formassingment/useUnassignFormToCompany';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormTemplateListForCompanyProps {
  companyId: string;
  companyName: string;
}

export default function FormTemplateList({ companyId, companyName }: FormTemplateListForCompanyProps) {
  const { formtemplates, loading: isLoading, error } = useGetAllFormTemplate();
  const { assignForm, loading: assignLoading } = useAssignFormToCompany();
  const { unassignForm, loading: unassignLoading } = useUnassignFormToCompany();
  const router = useRouter();
  const [assignedTemplates, setAssignedTemplates] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState<string | null>(null);

  const handleAssignTemplate = async (templateId: string, templateName: string) => {
    setAssigning(templateId);
    
    try {
      const result = await assignForm({
        companyId: companyId,
        formTemplateId: templateId,
        allowMultipleSubmissions: true,
        allowEditAfterSubmit: true,
      });

      if (result.success) {
        // Actualizar estado local
        setAssignedTemplates(prev => new Set([...prev, templateId]));
        toast.success(`Formulario "${templateName}" asignado a ${companyName}`);
      } else {
        toast.error(result.error || 'Error al asignar formulario');
      }
    } catch (error) {
      toast.error('Error al asignar el formulario');
    } finally {
      setAssigning(null);
    }
  };

  const handleUnassignTemplate = async (companyId: string) => {
  const confirmed = confirm("¿Deseas desasignar todos los formularios de esta compañía?");
  if (!confirmed) return;

  const result = await unassignForm(companyId);
  if (result?.success) {
    toast.success("Formularios desasignados correctamente");
    setAssignedTemplates(new Set());}
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando formularios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!formtemplates || formtemplates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <p className="text-center text-muted-foreground">
            No hay formularios disponibles. Crea uno nuevo para comenzar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {formtemplates.map((template) => {
        const moduleCount = template.moduleAssignments?.length || 0;
        const totalFields = template.moduleAssignments?.reduce(
          (acc: number, assignment: any) => acc + (assignment.module?.fields?.length || 0),
          0
        ) || 0;

        const isAssigned = assignedTemplates.has(template.id);
        const isProcessing = assigning === template.id;

        return (
          <Card 
            key={template.id} 
            className={`hover:shadow-md transition-shadow ${isAssigned ? 'border-green-500 bg-green-50' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-1">
                      {template.description || 'Sin descripción'}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={template.status === 'Activo' ? 'default' : 'secondary'}>
                  {template.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{moduleCount} módulo(s)</span>
                </div>
                {totalFields > 0 && (
                  <span>{totalFields} campo(s)</span>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(template.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {template.templateType}
                </Badge>
                {moduleCount === 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Sin módulos
                  </Badge>
                )}
                {isAssigned && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Asignada
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {!isAssigned ? (
                  <Button 
                    onClick={() => handleAssignTemplate(template.id, template.name)}
                    disabled={moduleCount === 0 || isProcessing}
                    size="sm"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Asignando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Asignar
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleUnassignTemplate(template.id)}
                    disabled={isProcessing}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Desasignando...
                      </>
                    ) : (
                      'Desasignar'
                    )}
                  </Button>
                )}
                
                <Button 
                  onClick={() => router.push(`/superadmin/formtemplate/fill/${template.id}`)}
                  disabled={moduleCount === 0}
                  variant="outline"
                  size="sm"
                >
                  Ver <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}