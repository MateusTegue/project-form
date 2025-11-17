"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ServerImageUpload from "../upload/ServerImageUpload";

export default function CompanyDataFields({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <h2 className="col-span-full text-md font-semibold text-gray-700">
        Datos de la Empresa
      </h2>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-sm">Nombre de la Empresa *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nit"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">NIT *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="razonSocial"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Razón Social</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">País *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Ciudad *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Dirección *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Logo</FormLabel>
            <FormControl>
              <Input {...field}  />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> 
      {/* <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
        <FormItem>
          <ServerImageUpload
            value={field.value}
            onChange={field.onChange}
            label="Logo de la empresa"
            description="Sube el logo (Max 5MB)"
            maxSizeMB={5}
          />
      <FormMessage />
    </FormItem>
      )}
    /> */}
    </div>
  );
}
