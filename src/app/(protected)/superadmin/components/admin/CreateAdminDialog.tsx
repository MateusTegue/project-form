"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateUserForm from "./CreateAdminForm";

export default function CreateAdminDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Crear Admin</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Administrador</DialogTitle>
        </DialogHeader>

        <CreateUserForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
