'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ModulesEmpty() {
  const router = useRouter();

  return (
    <Card className="h[20px] border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <Layers className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 ">
          No hay módulos disponibles
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Los módulos son reutilizables y pueden asociarse a múltiples formularios.
        </p>
      </CardContent>
    </Card>
  );
}