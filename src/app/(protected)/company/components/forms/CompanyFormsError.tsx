'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompanyFormsErrorProps {
  error: string | null;
}

export default function CompanyFormsError({ error }: CompanyFormsErrorProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implementa tu lógica de logout
    localStorage.clear();
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/company');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-destructive/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Error al cargar formularios</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                No se pudo acceder a la información
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Detalles del error</AlertTitle>
            <AlertDescription className="mt-2">
              {error || 'No se encontró información de la empresa'}
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>¿Qué puedo hacer?</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Verifica tu conexión a internet</li>
              <li>Intenta refrescar la página</li>
              <li>Cierra sesión e inicia sesión nuevamente</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleRefresh}
            className="w-full gap-2"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar página
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="w-full gap-2"
            variant="outline"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>

          <Button 
            onClick={handleLogout}
            className="w-full gap-2"
            variant="outline"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}