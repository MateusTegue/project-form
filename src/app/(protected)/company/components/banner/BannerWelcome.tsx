"use client";

import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BannerWelcomeProps {
  companyName: string;
  userName: string;
}

export default function BannerWelcome({ companyName, userName }: BannerWelcomeProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  return (
    <div className="space-y-2 text-white">
      {/* Saludo */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Building2 className="h-3 w-3 mr-1" />
            {companyName}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {greeting()}, {userName}! 👋
        </h1>
        <p className="text-white/80 text-sm md:text-base">
          Gestiona tus formularios y visualiza el estado de las solicitudes
        </p>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <Calendar className="h-4 w-4" />
        <span className="capitalize">{currentDate}</span>
      </div>
    </div>
  );
}