"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { createUserSchema } from "@/lib/validations";
import { useRoles } from "@/hooks/role/useRole";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import CountrySelect from "./CountrySelect";

type Props = {
  onSuccess?: () => void;
};

export default function CreateUserForm({ onSuccess }: Props) {
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      firstMiddleName: "",
      secondMiddleName: "",
      email: "",
      codePhone: "+57",
      phone: "",
      username: "",
      password: "",
      roleId: "",
    },
  });

  const { roles, loading, error } = useRoles();
  const { createUser } = useCreateUser();

  async function onSubmit(values: z.infer<typeof createUserSchema>) {
    const result = await createUser(values);
    if (result.success) {
      form.reset();
      onSuccess?.();
    } else {
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: "firstName", label: "Primer Nombre" },
          { name: "secondName", label: "Segundo Nombre" },
          { name: "firstMiddleName", label: "Primer Apellido" },
          { name: "secondMiddleName", label: "Segundo Apellido" },
          { name: "email", label: "Correo" },
          { name: "username", label: "Nombre de Usuario" },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof z.infer<typeof createUserSchema>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Teléfono con selector */}
        <CountrySelect form={form} />

        {/* Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rol */}
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loading && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                  {error && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                  {!loading && !error && roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Registrar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
