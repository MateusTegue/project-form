"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,} from "@/components/ui/dialog";
import { useDeleteCompany } from "@/app/(protected)/superadmin/hook/company/useDeleteCompany";
import { toast } from "react-hot-toast";
import { DeleteCompanyButtonProps } from "../../types/models";

export default function DeleteCompanyButton({ company, onSuccess, variant = "icon", size = "default",}: DeleteCompanyButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { deleteCompany, loading } = useDeleteCompany();

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const success = await deleteCompany(company.id);

      if (success) {
        toast.success("Compañía eliminada correctamente");
        setIsDialogOpen(false);

        if (onSuccess) {
          onSuccess(); 
        }
      }
    } catch (error: any) {
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={loading}
          className="bg-red-600 flex-1 text-white hover:text-white hover:bg-red-500"
          title="Eliminar compañía"
        >
          Desactivar
        </Button>
      ) : (
        <Button
          variant="destructive"
          size={size}
          onClick={handleDeleteClick}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Desactivar Compañía
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas desactivar la compañía?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="font-semibold text-amber-800 mb-1">
              {company.name}
            </h4>
            {company.nit && (
              <p className="text-sm text-amber-700">NIT: {company.nit}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Desactivando...
                </>
              ) : (
                "Desactivar Compañía"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
