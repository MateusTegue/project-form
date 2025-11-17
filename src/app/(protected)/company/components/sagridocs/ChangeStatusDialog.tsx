"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Submission, SubmissionStatus } from "../../types/models";
import toast from "react-hot-toast";
import { Clock, CheckCircle2, FileCheck, ArrowRight, RefreshCw, Info } from "lucide-react";

interface ChangeStatusDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChanged: () => void;
}

const statusOptions: { 
  value: SubmissionStatus; 
  label: string; 
  icon: React.ReactNode;
  color: string;
}[] = [
  { 
    value: "PENDIENTE", 
    label: "Pendiente",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-yellow-100 text-yellow-700 border-yellow-300"
  },
  { 
    value: "PROCESANDO", 
    label: "En proceso",
    icon: <FileCheck className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-700 border-blue-300"
  },
  { 
    value: "PROCESADO", 
    label: "Procesado",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-green-100 text-green-700 border-green-300"
  },
];

export default function ChangeStatusDialog({
  submission,
  open,
  onOpenChange,
  onStatusChanged,
}: ChangeStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | "">(
    submission?.status || ""
  );
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (submission) {
      setSelectedStatus(submission.status);
    }
  }, [submission]);

  const handleSave = async () => {
    if (!submission || !selectedStatus) return;

    if (selectedStatus === submission.status) {
      onOpenChange(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/submissions/${submission.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      toast.success("Estado actualizado exitosamente");
      onStatusChanged();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };

  const getStatusOption = (status: SubmissionStatus) => {
    return statusOptions.find((opt) => opt.value === status);
  };

  const currentStatusOption = submission ? getStatusOption(submission.status) : null;
  const selectedStatusOption = selectedStatus ? getStatusOption(selectedStatus as SubmissionStatus) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[40%]">
        <DialogHeader className="space-y-3 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Cambiar Estado del Formulario
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1.5">
                Actualiza el estado de procesamiento de este formulario
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Comparación de Estados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estado Actual */}
            <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Estado Actual
                    </label>
                  </div>
                  {currentStatusOption ? (
                    <div className="pt-2">
                      <Badge 
                        variant="outline" 
                        className={`${currentStatusOption.color} border-2 font-semibold px-4 py-2.5 text-sm w-full justify-start`}
                      >
                        <span className="flex items-center gap-2">
                          {currentStatusOption.icon}
                          <span>{currentStatusOption.label}</span>
                        </span>
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 pt-2">-</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Nuevo Estado */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-white shadow-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <RefreshCw className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Nuevo Estado
                    </label>
                  </div>
                  <div className="pt-2">
                    <Select
                      value={selectedStatus}
                      onValueChange={(value) =>
                        setSelectedStatus(value as SubmissionStatus)
                      }
                    >
                      <SelectTrigger className="h-12 border-2 border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <SelectValue placeholder="Selecciona un estado">
                          {selectedStatusOption ? (
                            <div className="flex items-center gap-2">
                              {selectedStatusOption.icon}
                              <span className="font-medium">{selectedStatusOption.label}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Selecciona un estado</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="cursor-pointer py-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              {option.icon}
                              <span className="font-medium">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

       

          {/* Vista previa del cambio */}
          {selectedStatusOption && selectedStatus !== submission?.status && (
            <Card className="border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 shadow-md animate-in fade-in-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Cambio de estado confirmado
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        El formulario cambiará a: <span className="font-medium">{selectedStatusOption.label}</span>
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${selectedStatusOption.color} border-2 font-semibold px-3 py-1.5 shrink-0`}
                  >
                    <span className="flex items-center gap-1.5">
                      {selectedStatusOption.icon}
                      {selectedStatusOption.label}
                    </span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensaje si no hay cambio */}
          {selectedStatus === submission?.status && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700">
                Selecciona un estado diferente para actualizar el formulario
              </p>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <DialogFooter className="gap-3 sm:gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="min-w-[120px]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || selectedStatus === submission?.status || !selectedStatus}
            className="min-w-[140px] bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Guardar Cambios
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

