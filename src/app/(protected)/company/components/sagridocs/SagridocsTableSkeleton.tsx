"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function SagridocsTableSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-muted-foreground">Cargando formularios...</p>
      </TableCell>
    </TableRow>
  );
}