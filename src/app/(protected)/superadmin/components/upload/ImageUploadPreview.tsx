'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadPreviewProps {
  preview: string;
  disabled?: boolean;
  uploading: boolean;
  onRemove: () => void;
  onClick: () => void;
}

export default function ImageUploadPreview({
  preview,
  disabled,
  uploading,
  onRemove,
  onClick
}: ImageUploadPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-32 mx-auto overflow-hidden rounded-lg bg-slate-100 border shadow-sm">
        <img
          src={preview}
          alt="Logo preview"
          className="h-full w-full object-contain p-2"
        />
        {!disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 shadow-lg"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Eliminar imagen</span>
          </Button>
        )}
      </div>
      
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={onClick}
          className="w-full gap-2"
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
          Cambiar logo
        </Button>
      )}
    </div>
  );
}