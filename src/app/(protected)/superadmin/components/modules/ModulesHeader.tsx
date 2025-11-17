'use client';

import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface ModulesHeaderProps {
  totalModules: number;
  activeModules: number;
}

export default function ModulesHeader({ totalModules, activeModules }: ModulesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Módulos</h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona tus módulos reutilizables
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {totalModules} total{totalModules !== 1 ? 'es' : ''}
          </Badge>
          <Badge variant="default" className="text-sm">
            {activeModules} activo{activeModules !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
    </div>
  );
}