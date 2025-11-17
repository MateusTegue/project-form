'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { PublicFormSubmitButtonProps } from '../../types/models';


export default function PublicFormSubmitButton({ submitting }: PublicFormSubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full gap-2" 
      size="lg"
      disabled={submitting}
    >
      {submitting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Enviando formulario...
        </>
      ) : (
        <>
          <Send className="h-5 w-5" />
          Enviar formulario
        </>
      )}
    </Button>
  );
}