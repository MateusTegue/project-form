"use client";

import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  loading: boolean;
}

export default function LoginButton({ loading }: LoginButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-11 text-md"
      disabled={loading}
    >
      {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
    </Button>
  );
}