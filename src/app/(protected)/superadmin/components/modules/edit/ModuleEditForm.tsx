'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, Layers } from 'lucide-react';
import { useUpdateModule } from '../../../hook/modules/useUpdateModule';
import { useGetAllModules } from '../../../hook/modules/useGetAllModules';
import FieldBuilder from '../../form-builder/FieldBuilder';
import { FormField } from '@/types/models';

interface ModuleEditFormProps {
  module: any;
}

export default function ModuleEditForm({ module }: ModuleEditFormProps) {
  const router = useRouter();
  const { updateModule, isLoading } = useUpdateModule();
  const { refetch } = useGetAllModules();
  const [formData, setFormData] = useState({
    name: module.name || '',
    description: module.description || '',
    isActive: module.isActive ?? true,
  });
  const [fields, setFields] = useState<FormField[]>([]);

  // Inicializar campos del módulo con sus IDs
  useEffect(() => {
    if (module.fields && Array.isArray(module.fields)) {
      const initializedFields = module.fields.map((field: any) => ({
        ...field,
        id: field.id, // Mantener el ID del campo existente
        options: field.options?.map((opt: any) => ({
          ...opt,
          id: opt.id, // Mantener el ID de la opción existente
        })) || [],
      }));
      setFields(initializedFields);
    }
  }, [module]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFieldsChange = (newFields: FormField[]) => {
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: any = {};
    if (formData.name !== module.name) updateData.name = formData.name;
    if (formData.description !== module.description) updateData.description = formData.description || null;
    if (formData.isActive !== module.isActive) updateData.isActive = formData.isActive;

    // Incluir campos si han cambiado
    const originalFields = module.fields || [];
    const fieldsChanged = JSON.stringify(fields) !== JSON.stringify(originalFields);
    
    if (fieldsChanged) {
      // Preparar campos para enviar (incluir IDs de campos y opciones existentes)
      updateData.fields = fields.map(field => ({
        ...field,
        id: field.id, // Incluir ID si existe (campo existente)
        options: field.options?.map(opt => ({
          ...opt,
          id: opt.id, // Incluir ID si existe (opción existente)
        })) || [],
      }));
    }

    // Solo actualizar si hay cambios
    if (Object.keys(updateData).length === 0) {
      router.push(`/superadmin/page/modules/${module.id}`);
      return;
    }

    const success = await updateModule(module.id, updateData);
    
    if (success) {
      // Refrescar la lista de módulos
      await refetch();
      // Redirigir al detalle del módulo
      router.push(`/superadmin/page/modules/${module.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Editar Módulo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del módulo *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Información General"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el propósito de este módulo..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Estado del módulo</Label>
              <p className="text-sm text-muted-foreground">
                Los módulos inactivos no pueden ser asignados a formularios
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Gestión de Campos */}
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
            Edita los campos del módulo. Puedes agregar nuevos campos, editar existentes o eliminar campos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldBuilder
            fields={fields}
            onFieldsChange={handleFieldsChange}
            readOnly={false}
            moduleKey={module.moduleKey}
          />
        </CardContent>
      </Card>
    </form>
  );
}