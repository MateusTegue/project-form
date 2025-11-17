
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface ModuleFormProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

const steps = [
  { id: 0, label: 'Información Básica', description: 'Nombre y descripción' },
  { id: 1, label: 'Campos', description: 'Campos del módulo' },
];

export default function ModuleFormProgress({ currentStep, totalSteps, progress }: ModuleFormProgressProps) {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full transition-colors
                  ${currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-200 text-slate-500'}
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-slate-200 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}