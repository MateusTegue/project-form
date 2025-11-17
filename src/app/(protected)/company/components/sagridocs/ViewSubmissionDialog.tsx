"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Submission } from "../../types/models";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { getModuleOrder, getFieldOrderForModule } from "@/utils/modulesAndFieldsData";

interface ViewSubmissionDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewSubmissionDialog({
  submission,
  open,
  onOpenChange,
}: ViewSubmissionDialogProps) {
  const [fullSubmission, setFullSubmission] = useState<Submission | null>(submission);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && submission) {
      fetchFullSubmission();
    }
  }, [open, submission?.id]);

  const fetchFullSubmission = async () => {
    if (!submission) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/submissions/${submission.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("Error al obtener el formulario");
      }

      const data = await response.json();
      setFullSubmission(data.data);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar el formulario");
      setFullSubmission(submission); // Usar el submission básico como fallback
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return null;

  // Agrupar respuestas por módulo y ordenar según el JSON
  const sortedModulesWithAnswers = useMemo(() => {
    if (!fullSubmission?.answers) return [];
    
    type AnswerType = Submission['answers'][number];
    const grouped: Record<string, { moduleName: string; moduleKey: string; answers: Array<AnswerType> }> = {};

    fullSubmission.answers.forEach((answer) => {
      const moduleKey = answer.field?.module?.moduleKey || '';
      const moduleName = answer.field?.module?.name || "Sin módulo";
      
      if (!grouped[moduleKey]) {
        grouped[moduleKey] = {
          moduleName,
          moduleKey,
          answers: []
        };
      }
      grouped[moduleKey].answers.push(answer);
    });

    // Ordenar módulos según el orden del JSON
    const moduleOrder = getModuleOrder();
    const modulesArray = Object.values(grouped);
    
    return modulesArray.sort((a, b) => {
      const orderA = moduleOrder.get(a.moduleKey || '') ?? 999;
      const orderB = moduleOrder.get(b.moduleKey || '') ?? 999;
      return orderA - orderB;
    }).map(moduleData => {
      // Ordenar campos dentro de cada módulo según el orden del JSON
      const fieldOrder = getFieldOrderForModule(moduleData.moduleKey || '');
      const sortedAnswers = [...moduleData.answers].sort((a, b) => {
        const fieldKeyA = a.field?.fieldKey || '';
        const fieldKeyB = b.field?.fieldKey || '';
        const orderA = fieldOrder.get(fieldKeyA) ?? 999;
        const orderB = fieldOrder.get(fieldKeyB) ?? 999;
        return orderA - orderB;
      });
      
      return {
        ...moduleData,
        answers: sortedAnswers
      };
    });
  }, [fullSubmission?.answers]);

  const getAnswerDisplayValue = (answer: Submission['answers'][number]) => {
    if (answer.textValue) return answer.textValue;
    if (answer.numberValue !== undefined && answer.numberValue !== null) {
      return answer.numberValue.toString();
    }
    if (answer.dateValue) {
      return new Date(answer.dateValue).toLocaleDateString("es-ES");
    }
    return "-";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Información del Formulario
          </DialogTitle>
          <DialogDescription>
            Detalles del formulario enviado el{" "}
            {new Date(fullSubmission?.submittedAt || submission.submittedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
          <div className="space-y-6">
            {/* Información del remitente */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">
                Información del Remitente
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Nombre</p>
                  <p className="font-medium">{fullSubmission?.submitterName || submission.submitterName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{fullSubmission?.submitterEmail || submission.submitterEmail}</p>
                </div>
                {(fullSubmission?.submitterPhone || submission.submitterPhone) && (
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{fullSubmission?.submitterPhone || submission.submitterPhone}</p>
                  </div>
                )}
                {(fullSubmission?.submitterDocumentId || submission.submitterDocumentId) && (
                  <div>
                    <p className="text-sm text-slate-600">Documento</p>
                    <p className="font-medium">{fullSubmission?.submitterDocumentId || submission.submitterDocumentId}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Información por módulo */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Respuestas por Módulo
              </h3>

              {sortedModulesWithAnswers.map((moduleData) => (
                <div key={moduleData.moduleKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-primary">
                      {moduleData.moduleName}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {moduleData.answers.length} campo{moduleData.answers.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                    {moduleData.answers.map((answer) => (
                      <div key={answer.id} className="space-y-1">
                        <p className="text-sm font-medium text-slate-700">
                          {answer.field?.label || answer.fieldKey}
                        </p>
                        <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200">
                          {getAnswerDisplayValue(answer)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

