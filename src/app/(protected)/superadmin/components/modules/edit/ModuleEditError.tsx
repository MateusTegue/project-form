'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModuleEditErrorProps {
  message: string;
}

export default function ModuleEditError({ message }: ModuleEditErrorProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-3">
              <p className="mb-4">{message}</p>
              <Button 
                variant="outline"
                onClick={() => router.back()}
                className="gap-2 bg-background"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}