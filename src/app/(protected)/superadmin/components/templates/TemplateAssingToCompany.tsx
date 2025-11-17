"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllFormTemplate } from "../../hook/formtemplate/useGetAllFormTemplate";
import { useAssignFormToCompany } from "../../hook/formassingment/useAssingFormToCompany";
import toast from "react-hot-toast";
import { FormTemplateList } from "./TemplateFormList";
import { FormAssignmentDialog } from "./TemplateAssignmentDialog";

export function TemplateAssignToCompany({ companyId, companyName }: { companyId: string; companyName: string }) {
  const { formtemplates, loading: isLoading } = useGetAllFormTemplate();
  const { assignForm, loading: assigning } = useAssignFormToCompany();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleOpenDialog = (template: any) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleAssign = async (config: any) => {
    if (!selectedTemplate) {
      toast.error("Error: No se seleccionó formulario");
      return;
    }

    const result = await assignForm({
      companyId,
      formTemplateId: selectedTemplate.id,
      ...config,
    });

    if (result.success) {
      setIsDialogOpen(false);
      toast.success("Formulario asignado correctamente");
    } else {
      toast.error("Error al asignar");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Cargando formularios...</span>
        </CardContent>
      </Card>
    );
  }

  const activeTemplates =
    formtemplates?.filter((t) => t.moduleAssignments?.length > 0) || [];

  return (
    <>
      <FormTemplateList templates={activeTemplates} onSelect={handleOpenDialog} companyName={companyName} />
      <FormAssignmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={selectedTemplate}
        companyName={companyName}
        assigning={assigning}
        onConfirm={handleAssign}
      />
    </>
  );
}
