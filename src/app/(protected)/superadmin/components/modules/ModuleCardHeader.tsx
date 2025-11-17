'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import type { Module } from './GetAllModulesCreated';

interface ModuleCardHeaderProps {
  module: Module;
}

export default function ModuleCardHeader({ module }: ModuleCardHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <Badge 
          variant={module.isActive ? 'default' : 'secondary'}
          className="shrink-0"
        >
          {module.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
      
      <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
        {module.name}
      </CardTitle>
      
      <CardDescription className="line-clamp-2">
        {module.description || 'Sin descripción disponible'}
      </CardDescription>
    </CardHeader>
  );
}