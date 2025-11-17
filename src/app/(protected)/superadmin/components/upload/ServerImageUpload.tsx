'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useImageUpload } from '../../hook/upload/useImageUpload';
import ImageUploadPreview from './ImageUploadPreview';
import ImageUploadEmpty from './ImageUploadEmpty';
import ImageUploadLoading from './ImageUploadLoading';

interface ServerImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

export default function ServerImageUpload({
  value,
  onChange,
  label = "Logo de la empresa",
  description = "Sube el logo de tu empresa",
  disabled = false,
  maxSizeMB = 5
}: ServerImageUploadProps) {
  const {
    preview,
    uploading,
    inputRef,
    handleFileChange,
    handleRemove,
    handleClick,
  } = useImageUpload({ value, onChange, maxSizeMB });

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      
        <div className="p-4">
          {uploading ? (
            <ImageUploadLoading />
          ) : preview ? (
            <ImageUploadPreview
              preview={preview}
              disabled={disabled}
              uploading={uploading}
              onRemove={handleRemove}
              onClick={handleClick}
            />
          ) : (
            <ImageUploadEmpty
              description={description}
              disabled={disabled}
              onClick={handleClick}
            />
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || uploading}
            aria-label="Subir imagen"
          />
        </div>
      
    </div>
  );
}