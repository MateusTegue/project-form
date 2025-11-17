'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField, FieldTypeEnum } from '@/types/models';
import FieldFormBasicInfo from './field-form/FieldFormBasicInfo';
import FieldFormOptions from './field-form/FieldFormOptions';
import { generateFieldKey } from '../../utils/fieldKeyGenerator';

interface FieldBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldForm: Partial<FormField>;
  setFieldForm: (form: Partial<FormField>) => void;
  editingIndex: number | null;
  fields: FormField[];
  onSave: (field: FormField) => void;
  moduleKey?: string;
}

export default function FieldBuilderDialog({
  open,
  onOpenChange,
  fieldForm,
  setFieldForm,
  editingIndex,
  fields,
  onSave,
  moduleKey
}: FieldBuilderDialogProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiresOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(fieldForm.fieldType || '');

  const validateField = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fieldForm.label?.trim()) {
      newErrors.label = 'La etiqueta es requerida';
    }

    if (!fieldForm.fieldKey?.trim()) {
      newErrors.fieldKey = 'La clave es requerida';
    } else if (!/^[a-z0-9_]+$/.test(fieldForm.fieldKey)) {
      newErrors.fieldKey = 'Solo letras minúsculas, números y guiones bajos';
    }

    const isDuplicate = fields.some(
      (field, index) => field.fieldKey === fieldForm.fieldKey && index !== editingIndex
    );
    if (isDuplicate) {
      newErrors.fieldKey = 'Ya existe un campo con esta clave';
    }

    if (requiresOptions && (!fieldForm.options || fieldForm.options.length === 0)) {
      newErrors.options = 'Debe agregar al menos una opción';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateField()) {
      return;
    }

    const newField: FormField = {
      id: fieldForm.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: fieldForm.label!,
      fieldKey: fieldForm.fieldKey!,
      fieldType: fieldForm.fieldType!,
      placeholder: fieldForm.placeholder,
      helpText: fieldForm.helpText,
      isRequired: fieldForm.isRequired ?? false,
      displayOrder: fieldForm.displayOrder ?? fields.length + 1,
      isActive: fieldForm.isActive ?? true,
      validations: fieldForm.validations,
      layoutConfig: fieldForm.layoutConfig,
      options: fieldForm.options
    };

    onSave(newField);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[40%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingIndex !== null ? 'Editar Campo' : 'Nuevo Campo'}
          </DialogTitle>
          <DialogDescription>
            Define las características del campo del formulario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FieldFormBasicInfo
            fieldForm={fieldForm}
            setFieldForm={setFieldForm}
            errors={errors}
            moduleKey={moduleKey}
          />

          {requiresOptions && (
            <FieldFormOptions
              fieldForm={fieldForm}
              setFieldForm={setFieldForm}
              errors={errors}
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {editingIndex !== null ? 'Actualizar' : 'Guardar'} Campo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}