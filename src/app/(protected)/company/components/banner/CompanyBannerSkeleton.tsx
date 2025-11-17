"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompanyBannerSkeleton() {
  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 bg-white/20" />
              <Skeleton className="h-10 w-64 bg-white/20" />
              <Skeleton className="h-4 w-96 bg-white/20" />
            </div>

            <Skeleton className="h-4 w-48 bg-white/20" />
          </div>

          <div className="flex items-center">
            <Card className="bg-white/95 backdrop-blur border-white/20 w-full">
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}