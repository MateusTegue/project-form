"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import { FilterByStatusDialogProps } from "../../types/models";



export default function FilterByStatusDialog({ onFilter }: FilterByStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onFilter(selectedStatus);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedStatus(null);
    onFilter("ACTIVO"); 
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-white hover:bg-gray-800">
          <FilterIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-74 bg-white">
        <DialogHeader>
          <DialogTitle>Filtrar por Estado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select 
            value={selectedStatus || undefined}
            onValueChange={(value) => {
              setSelectedStatus(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="INACTIVO">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Limpiar
            </Button>
            <Button onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}