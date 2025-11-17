'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PublicFormSuccessProps } from '../../types/models';

export default function PublicFormSuccess({ message, companyName, redirectUrl }: PublicFormSuccessProps) {
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  const handleRedirect = () => {
    if (redirectUrl && redirectUrl.trim() !== '') {
      setRedirecting(true);
      window.location.href = redirectUrl.trim();
    }
  };

  useEffect(() => {
    if (redirectUrl && redirectUrl.trim() !== '') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [redirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-slate-100 p-4">
      <Card className="max-w-md w-full border border-green-500 shadow-md">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-2">¡Formulario enviado!</CardTitle>
              <CardDescription className="text-base">
                {message || 
                 'Gracias por completar el formulario. Hemos recibido tu información correctamente.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-4">
          {redirectUrl && redirectUrl.trim() !== '' ? (
            <div className="space-y-3">
              <p className="text-sm text-center text-gray-600">
                Serás redirigido automáticamente en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
              <Button 
                onClick={handleRedirect} 
                disabled={redirecting}
                className="w-full"
                variant="default"
              >
                {redirecting ? (
                  'Redirigiendo...'
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir ahora
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Tu información ha sido recibida correctamente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}