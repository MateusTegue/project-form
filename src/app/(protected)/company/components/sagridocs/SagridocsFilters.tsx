"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { SubmissionStatus } from "../../types/models";
import { SagridocsFiltersProps } from "../../types/models";


const filters: { label: string; value: SubmissionStatus }[] = [
  { label: "Pendientes", value: "PENDIENTE" },
  { label: "En proceso", value: "PROCESANDO" },
  { label: "Procesados", value: "PROCESADO" },
];

export default function SagridocsFilters({ currentStatus, onStatusChange }: SagridocsFiltersProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentStatus === filter.value ? "default" : "outline"}
          onClick={() => onStatusChange(filter.value)}
          className="transition-all"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}