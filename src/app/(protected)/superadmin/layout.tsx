import AuthLayout from "@/app/unauthorized/AuthLayout";
import VerticalMenu from "@/components/menu/MenuNavegation";
import React from "react";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  return (
     <AuthLayout requiredRole="SUPER_ADMIN" redirectPath="/login">
    <div className="flex min-h-screen">
      <aside className="h-screen flex-shrink-0 sticky top-0 overflow-y-auto">
        <VerticalMenu role="SUPER_ADMIN" />
      </aside>
      <main className="flex-1 h-screen overflow-y-auto">{children}</main>
    </div>
    </AuthLayout>
  );
}