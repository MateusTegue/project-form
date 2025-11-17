'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Home, Mail, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PublicFormAlreadySubmittedProps } from '../../types/models';

export default function PublicFormAlreadySubmitted({  companyName,  formName, allowMultiple }: PublicFormAlreadySubmittedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-slate-100 p-4">
      <Card className="max-w-md w-full border-2 border-amber-500 shadow-xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-amber-100 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-2">
                Formulario ya enviado
              </CardTitle>
              <CardDescription className="text-base">
                {allowMultiple 
                  ? 'Ya has enviado este formulario. Puedes enviarlo nuevamente si lo deseas.'
                  : 'Ya has completado y enviado este formulario anteriormente.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">
              ¿Por qué veo este mensaje?
            </AlertTitle>
            <AlertDescription className="text-amber-800 text-sm mt-2">
              {allowMultiple 
                ? `Este formulario permite múltiples envíos. Si necesitas actualizarlo, puedes enviar una nueva versión.`
                : `Este formulario solo permite un envío por persona. Tu información ya fue recibida correctamente.`}
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">¿Necesitas hacer cambios?</p>
                <p>
                  {companyName 
                    ? `Contacta al equipo de ${companyName} para solicitar modificaciones o si tienes alguna duda.`
                    : 'Contacta al administrador del formulario si necesitas hacer cambios.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full gap-2"
              size="lg"
            >
              <Home className="h-5 w-5" />
              Volver al inicio
            </Button>
            
            {allowMultiple && (
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                Enviar nuevamente
              </Button>
            )}
          </div>

          {formName && (
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Formulario: <span className="font-medium">{formName}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}