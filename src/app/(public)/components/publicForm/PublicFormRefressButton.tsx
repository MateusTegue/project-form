// boton para refrescar el formulario publico
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { PublicFormRefressButtonProps } from '../../types/models';

export default function PublicFormRefressButton({ refreshing, onRefresh }: PublicFormRefressButtonProps) {
  return (
    <Button 
      type="button" 
      className="w-full gap-2 cursor-pointer" 
      size="lg"
      disabled={refreshing}
      onClick={onRefresh}
    >
      {refreshing ? (
        <>
          <RefreshCcw className="h-5 w-5 animate-spin" />
          Refrescando formulario...
        </>
      ) : (
        <>
          <RefreshCcw className="h-5 w-5" />
          Refrescar formulario
        </>
      )}
    </Button>
  );
}