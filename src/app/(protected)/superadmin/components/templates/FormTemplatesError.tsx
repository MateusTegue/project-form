'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormTemplatesErrorProps {
  error: string;
  onRetry?: () => void;
}

export default function FormTemplatesError({ error, onRetry }: FormTemplatesErrorProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Error al cargar formularios
            </AlertTitle>
            <AlertDescription className="mt-3">
              <p className="mb-4">{error}</p>
              
              <div className="flex items-center gap-3">
                {onRetry && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRetry}
                    className="gap-2 bg-background"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reintentar
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/superadmin/page/formstemplates')}
                  className="gap-2 bg-background"
                >
                  <Home className="h-4 w-4" />
                  Volver
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

