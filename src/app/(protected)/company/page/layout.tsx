import AuthLayout from "@/app/unauthorized/AuthLayout";
import VerticalMenu from "@/components/menu/MenuNavegation";

export const metadata = {
  title: "Panel de compañía",
};

export default function DashboardOperator({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout requiredRole="COMPANY" redirectPath="/login">
      <div className="w-full flex min-h-screen max-h-screen overflow-hidden">
        <aside className="h-screen flex-shrink-0 sticky top-0 overflow-y-auto">
          <VerticalMenu role="COMPANY" />
        </aside>
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthLayout>
  );
}