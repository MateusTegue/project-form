'use client';

import React from 'react';
import { FormField } from '@/types/models';
import FieldBuilderItem from './FieldBuilderItem';

interface FieldBuilderListProps {
  fields: FormField[];
  readOnly: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function FieldBuilderList({ 
  fields, 
  readOnly, 
  onEdit, 
  onDelete 
}: FieldBuilderListProps) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No hay campos. Agrega campos para este módulo.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <FieldBuilderItem
          key={index}
          field={field}
          index={index}
          readOnly={readOnly}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}