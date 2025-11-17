"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function BannerQuickActions() {
  const actions = [
    {
      label: 'Formularios',
      icon: FileText,
      href: '/company/page/forms',
      color: 'hover:bg-blue-50'
    },
    {
      label: 'Usuarios',
      icon: Users,
      href: '/company/page/users',
      color: 'hover:bg-green-50'
    },
    {
      label: 'Reportes',
      icon: BarChart3,
      href: '/company/page/reports',
      color: 'hover:bg-purple-50'
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/company/page/settings',
      color: 'hover:bg-slate-50'
    },
  ];

  return (
    <Card className="bg-white/95 backdrop-blur border-white/20 w-full">
      <div className="p-2">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Acceso Rápido
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 h-auto py-3 ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}