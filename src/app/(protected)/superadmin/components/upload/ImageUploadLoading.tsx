'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ImageUploadLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
      <p className="text-xs text-muted-foreground mt-1">Por favor espera</p>
    </div>
  );
}