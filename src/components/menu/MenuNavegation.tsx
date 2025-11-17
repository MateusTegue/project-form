"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; 
import { menuItems } from "./MenuOptions";
import logoApp from "../../../public/logov1.png";
import LogOutButton from "@/app/(public)/login/LogOutButton";


export default function VerticalMenu({ role }: { role: "SUPER_ADMIN" | "COMPANY" }) {
  const pathname = usePathname();
  const items = menuItems[role];


  return (
    <nav className="flex flex-col w-54 h-screen border-r border-gray-200">
      <div className="mb-2 h-16 flex items-center border-b border-gray-200">
        <img src={logoApp.src} alt="Logo" className="w-24 h-9 mb-2 mx-auto" />
      </div>
      <div className="flex-1 flex flex-col gap-2 pr-4 pl-4">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.key}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.key
                ? "bg-secondary text-black"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto flex flex-col items-center gap-2 py-4 border-t border-gray-200">
        <LogOutButton />

        <p className="text-xs text-gray-500 ">cap.in by Txen</p>
      </div>
    </nav>
  );
}
