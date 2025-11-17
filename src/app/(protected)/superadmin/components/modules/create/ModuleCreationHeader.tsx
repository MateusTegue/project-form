
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModuleFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

const stepTitles = [
  'Información Básica',
  'Campos del Módulo'
];

export default function ModuleFormHeader({ currentStep, totalSteps, onBack }: ModuleFormHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        )}
        
        <div>
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            Crear Nuevo Módulo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stepTitles[currentStep]} • Paso {currentStep + 1} de {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}