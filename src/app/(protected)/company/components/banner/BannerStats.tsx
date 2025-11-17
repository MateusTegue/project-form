"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';


interface BannerStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

// Flag de desarrollo - cambia a false cuando esté listo
const IS_UNDER_DEVELOPMENT = true;

export default function BannerStats({ stats }: BannerStatsProps) {
  const statsData = [
    {
      label: 'Total',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      highlight: stats.pending > 0
    },
    {
      label: 'Aprobadas',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Rechazadas',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statsData.map((stat) => (
        <Card 
          key={stat.label}
          className={cn(
            "bg-white/95 backdrop-blur border-white/20 hover:shadow-lg transition-all",
            stat.highlight && "ring-2 ring-amber-400"
          )}
        >
          <div className="p-2">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-600">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}