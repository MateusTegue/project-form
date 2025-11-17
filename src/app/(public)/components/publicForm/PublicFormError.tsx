'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { PublicFormErrorProps } from '../../types/models';



export default function PublicFormError({ error, onRetry }: PublicFormErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="max-w-md w-full border-2 border-destructive/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Error al cargar formulario</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar el formulario</AlertTitle>
            <AlertDescription className="mt-2">
              {error || 'El formulario no está disponible o no existe.'}
            </AlertDescription>
          </Alert>

          {onRetry && (
            <div className="flex gap-3">
              <Button 
                onClick={onRetry}
                className="flex-1 gap-2"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}