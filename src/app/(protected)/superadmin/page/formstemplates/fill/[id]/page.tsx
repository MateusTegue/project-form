
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FormTemplate, FormField } from '@/types/models';


export default function FillFormTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/formtemplate/${templateId}`);
        const response = await res.json();

        if (response.success && response.data) {
          setTemplate(response.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          data: formData
        })
      });

      if (res.ok) {
        alert('Formulario enviado exitosamente');
        router.push('/superadmin/formtemplate');
      }
    } catch (error) {
      alert('Error al enviar el formulario');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.fieldKey,
      required: field.isRequired,
      placeholder: field.placeholder || '',
    };

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <Input
            {...commonProps}
            type="text"
            value={formData[field.fieldKey] || ''}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
          />
        );

      case 'EMAIL':
        return (
          <Input
            {...commonProps}
            type="email"
            value={formData[field.fieldKey] || ''}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
          />
        );

      case 'NUMBER':
        return (
          <Input
            {...commonProps}
            type="number"
            value={formData[field.fieldKey] || ''}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
          />
        );

      case 'DATE':
        return (
          <Input
            {...commonProps}
            type="date"
            value={formData[field.fieldKey] || ''}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
          />
        );

      case 'TEXTAREA':
        return (
          <Textarea
            {...commonProps}
            value={formData[field.fieldKey] || ''}
            onChange={(e) => handleFieldChange(field.fieldKey, e.target.value)}
            rows={4}
          />
        );

      case 'SELECT':
        return (
          <Select
            value={formData[field.fieldKey] || ''}
            onValueChange={(value) => handleFieldChange(field.fieldKey, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'RADIO':
        return (
          <RadioGroup
            value={formData[field.fieldKey] || ''}
            onValueChange={(value) => handleFieldChange(field.fieldKey, value)}
          >
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.fieldKey}-${option.id}`} />
                <Label htmlFor={`${field.fieldKey}-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.fieldKey}-${option.id}`}
                  checked={formData[field.fieldKey]?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const current = formData[field.fieldKey] || [];
                    const updated = checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value);
                    handleFieldChange(field.fieldKey, updated);
                  }}
                />
                <Label htmlFor={`${field.fieldKey}-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando formulario...</span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">Formulario no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!template.moduleAssignments || template.moduleAssignments.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Este formulario no tiene módulos ni campos configurados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push(`/superadmin/formtemplate/${templateId}/edit`)}
            >
              Configurar Formulario
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Badge variant="outline">{template.templateType}</Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">{template.name}</CardTitle>
                {template.description && (
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {template.moduleAssignments.map((assignment, index) => (
          <Card key={assignment.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assignment.module.name}</CardTitle>
                {assignment.isRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Obligatorio
                  </Badge>
                )}
              </div>
              {assignment.module.description && (
                <CardDescription>{assignment.module.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {assignment.module.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.fieldKey}>
                    {field.label}
                    {field.isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {field.helpText && (
                    <p className="text-sm text-muted-foreground">{field.helpText}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Botón de envío */}
        <Card className="border-2 bg-slate-50">
          <CardContent className="pt-6">
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enviar Formulario
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}