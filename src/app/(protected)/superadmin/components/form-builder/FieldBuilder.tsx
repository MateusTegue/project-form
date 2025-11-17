'use client';

import React, { useState } from 'react';
import { FormField, FieldTypeEnum } from '@/types/models';
import FieldBuilderHeader from './FieldBuilderHeader';
import FieldBuilderDialog from './FieldBuilderDialog';
import FieldBuilderList from './FieldBuilderList';
import FieldBuilderDeleteDialog from './FieldBuilderDeleteDialog';

interface FieldBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  readOnly?: boolean;
  moduleKey?: string;
}

export default function FieldBuilder({ fields, onFieldsChange, readOnly = false, moduleKey }: FieldBuilderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [fieldForm, setFieldForm] = useState<Partial<FormField>>({
    label: '',
    fieldKey: '',
    fieldType: FieldTypeEnum.TEXT,
    placeholder: '',
    helpText: '',
    isRequired: false,
    displayOrder: fields.length + 1,
    isActive: true,
    options: undefined
  });

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setFieldForm(fields[index]);
    } else {
      setEditingIndex(null);
      setFieldForm({
        label: '',
        fieldKey: '',
        fieldType: FieldTypeEnum.TEXT,
        placeholder: '',
        helpText: '',
        isRequired: false,
        displayOrder: fields.length + 1,
        isActive: true,
        options: undefined
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveField = (field: FormField) => {
    const newFields = [...fields];
    if (editingIndex !== null) {
      newFields[editingIndex] = field;
    } else {
      newFields.push(field);
    }
    onFieldsChange(newFields);
    setIsDialogOpen(false);
  };

  const handleDeleteField = () => {
    if (deleteIndex !== null) {
      onFieldsChange(fields.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <FieldBuilderHeader
        readOnly={readOnly}
        onOpenDialog={() => handleOpenDialog()}
        onDialogOpenChange={setIsDialogOpen}
      />

      <FieldBuilderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        fieldForm={fieldForm}
        setFieldForm={setFieldForm}
        editingIndex={editingIndex}
        fields={fields}
        onSave={handleSaveField}
        moduleKey={moduleKey}
      />

      <FieldBuilderList
        fields={fields}
        readOnly={readOnly}
        onEdit={handleOpenDialog}
        onDelete={setDeleteIndex}
      />

      <FieldBuilderDeleteDialog
        open={deleteIndex !== null}
        onOpenChange={() => setDeleteIndex(null)}
        onConfirm={handleDeleteField}
      />
    </div>
  );
}