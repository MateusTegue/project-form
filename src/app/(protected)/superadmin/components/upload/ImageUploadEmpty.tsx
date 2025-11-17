'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadEmptyProps {
  description: string;
  disabled?: boolean;
  onClick: () => void;
}

export default function ImageUploadEmpty({
  description,
  disabled,
  onClick
}: ImageUploadEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="p-3 bg-primary/10 rounded-full mb-3">
        <ImageIcon className="h-8 w-8 text-primary" />
      </div>
      
      <p className="text-sm font-medium text-center mb-1 px-4">
        {description}
      </p>
      
      <p className="text-xs text-muted-foreground mb-4">
        JPG, PNG, WebP - Máx 5MB
      </p>
      
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={disabled}
      >
        <Upload className="h-4 w-4" />
        Seleccionar archivo
      </Button>
    </div>
  );
}