'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function CompanyEditLoading() {
  return (
    <main className="w-full h-full">
      {/* Header Skeleton */}
      <div className="w-full h-16 border-b bg-white flex justify-between items-center px-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      <div className="w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Skeleton */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Loading Message */}
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-3" />
        <span className="text-muted-foreground">Cargando compañía...</span>
      </div>
    </main>
  );
}