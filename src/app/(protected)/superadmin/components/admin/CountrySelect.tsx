"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { createUserSchema } from "@/lib/validations";
import { z } from "zod";

const countryCodes = [
  { code: "+57", country: "Colombia" },
  { code: "+56", country: "Chile" },
];

type Props = {
  form: UseFormReturn<z.infer<typeof createUserSchema>>;
};

export default function CountrySelect({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Teléfono</FormLabel>
          <FormControl>
            <div className="flex">
              <FormField
                control={form.control}
                name="codePhone"
                render={({ field: codeField }) => (
                  <Select onValueChange={codeField.onChange} defaultValue={codeField.value}>
                    <SelectTrigger className="w-[100px] rounded-r-none border-r-0">
                      <SelectValue placeholder="+57" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map(c => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} {c.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input {...field} className="rounded-l-none flex-1" type="tel" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
