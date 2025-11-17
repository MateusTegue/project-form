"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateCompanyDialog from "./CreateCompanyDialog";

export default function CreateCompanyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear Empresa</Button>
      <CreateCompanyDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
