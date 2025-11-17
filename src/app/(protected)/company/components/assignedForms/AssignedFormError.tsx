'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssignedFormErrorProps } from '../../types/models';

const AssignedFormError: React.FC<AssignedFormErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar formularios</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">{error}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AssignedFormError;