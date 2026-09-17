"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ListPlus,
  LogOut,
  Moon,
  Package,
  Sun,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTheme } from "@/contexts/ThemeContext";

const menuItems = [
  { name: "Pedidos", href: "/dashboard", icon: ClipboardList },
  { name: "Categorias", href: "/categories", icon: ListPlus },
  { name: "Produtos", href: "/products", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-zinc-200 bg-zinc-100 p-4 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="space-y-6">
        <div className="px-2">
          <h2 className="text-xl font-bold tracking-tight text-primary">
            OrderFlow
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Painel Administrativo
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                }`}
                style={isActive ? { backgroundColor: "var(--primary)" } : undefined}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Modo claro" : "Modo escuro"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}