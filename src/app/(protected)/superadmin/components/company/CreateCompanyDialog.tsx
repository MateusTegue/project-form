"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompanyForm from "./CompanyForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCompanyDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[50vw] max-w-5xl bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Crear Nueva Empresa</DialogTitle>
        </DialogHeader>
        <CompanyForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
