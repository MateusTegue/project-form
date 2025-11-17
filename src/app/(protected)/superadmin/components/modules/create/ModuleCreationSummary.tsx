'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface ModuleFormSummaryProps {
  fieldsCount: number;
  canSubmit: boolean;
  isLoading: boolean;
  onBack: () => void;
  onSubmit?: () => void;
}

export default function ModuleFormSummary({ fieldsCount, canSubmit, isLoading, onBack, onSubmit }: ModuleFormSummaryProps) {
  return (
    <Card className="border-2 bg-gradient-to-r from-slate-50 to-blue-50">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {canSubmit ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              <p className="text-sm font-medium">
                {canSubmit ? (
                  <span className="text-green-600">
                    ✓ Módulo listo para guardar
                  </span>
                ) : (
                  <span className="text-amber-600">
                    {fieldsCount === 0 
                      ? 'Agrega al menos un campo' 
                      : 'Completa todos los datos requeridos'}
                  </span>
                )}
              </p>
            </div>
            
            {fieldsCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {fieldsCount} campo{fieldsCount !== 1 ? 's' : ''} agregado{fieldsCount !== 1 ? 's' : ''}. 
                Este módulo podrá ser reutilizado en múltiples formularios.
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>

            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !canSubmit}
              className="flex-1 sm:flex-none min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Módulo
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}