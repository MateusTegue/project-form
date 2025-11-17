"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { SagridocsLoadingProps } from "../../types/models";

export default function SagridocsLoading({ message = "Cargando..." }: SagridocsLoadingProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}