
"use client";
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SagridocsItem from "./SagridocsItem";
import SagridocsEmpty from "./SagridocsEmpty";
import SagridocsTableSkeleton from "./SagridocsTableSkeleton";
import { SagridocsTableProps } from "../../types/models";

export default function SagridocsTable({ submissions, loading, searchQuery, currentStatus, onClearSearch, onRefresh }: SagridocsTableProps & { onRefresh?: () => void }) {
  
  return (
      <>
        <div className="relative max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700 py-4 px-4">Fecha</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-4">Razón Social</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-4">NIT</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-4">Email</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 px-4">Tipo de Tercero</TableHead>
                <TableHead className="text-center font-semibold text-slate-700 py-4 px-4">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <SagridocsTableSkeleton />
              ) : submissions.length === 0 ? (
                <SagridocsEmpty 
                  searchQuery={searchQuery}
                  currentStatus={currentStatus}
                  onClearSearch={onClearSearch}
                />
              ) : (
                submissions.map((submission) => (
                  <SagridocsItem 
                    key={submission.id} 
                    submission={submission}
                    onStatusChanged={onRefresh || onClearSearch}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && submissions.length > 0 && (
          <div className="border-t bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Mostrando <span className="font-semibold">{submissions.length}</span> resultado{submissions.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Página 1 de 1</span>
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
  );
}