'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Lock } from 'lucide-react';

interface FieldBuilderHeaderProps {
  readOnly: boolean;
  onOpenDialog: () => void;
  onDialogOpenChange: (open: boolean) => void;
}

export default function FieldBuilderHeader({ 
  readOnly, 
  onOpenDialog,
  onDialogOpenChange 
}: FieldBuilderHeaderProps) {
  if (readOnly) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Lock className="h-4 w-4" />
            <p className="text-sm">
              <strong>Módulo protegido:</strong> Los campos de este módulo son predefinidos y no pueden ser modificados ni eliminados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onOpenDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Campo
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}