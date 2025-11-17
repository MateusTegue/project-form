"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryCodes = [{ code: "+57", country: "Colombia" }];

export default function ContactDataFields({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <h2 className="col-span-full text-md font-semibold text-gray-700">
        Datos de Contacto
      </h2>

      <FormField
        control={form.control}
        name="contactFirstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Nombre *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactLastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Apellido *</FormLabel>
            <FormControl>
              <Input {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-sm">Email *</FormLabel>
            <FormControl>
              <Input {...field} type="email" className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-sm">Teléfono *</FormLabel>
            <FormControl>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="contactPhoneCountryCode"
                  render={({ field: codeField }) => (
                    <Select
                      onValueChange={codeField.onChange}
                      defaultValue={codeField.value}
                    >
                      <SelectTrigger className="w-[100px] rounded-r-none border-r-0">
                        <SelectValue placeholder="+57" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                          >
                            {country.code} {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...field}
                  className="rounded-l-none flex-1"
                  type="tel"
                  placeholder="3105678901"
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPassword"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-sm">Contraseña *</FormLabel>
            <FormControl>
              <Input type="password" {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
