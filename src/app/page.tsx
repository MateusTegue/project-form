'use client'
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login"); // redirige a tu página pública de login
  return null;
}
