"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createCompanySchema } from "@/lib/validations";
import { useCreateCompany } from "@/app/(protected)/superadmin/hook/company/useCreateCompany";
import { authService } from "@/lib/auth";
import CompanyDataFields from "./CompanyDataFields";
import ContactDataFields from "./ContactDataFields";

interface Props {
  onSuccess: () => void;
}

export default function CompanyForm({ onSuccess }: Props) {
  const { createCompany, isLoading } = useCreateCompany();

  const form = useForm<z.infer<typeof createCompanySchema>>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      nit: "",
      razonSocial: "",
      country: "",
      city: "",
      address: "",
      logoUrl: "",
      contactEmail: "",
      contactPhone: "",
      contactPhoneCountryCode: "+57",
      contactFirstName: "",
      contactLastName: "",
      contactPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createCompanySchema>) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast.error("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    const result = await createCompany(values);
    if (result.success) {
      onSuccess();
      form.reset();
    } else {
      toast.error("Error al crear la empresa");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <CompanyDataFields form={form} />
        <ContactDataFields form={form} />
        <div className="col-span-2 flex justify-end pt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Empresa"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
