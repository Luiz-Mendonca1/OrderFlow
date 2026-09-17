"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ListPlus,
  LogOut,
  Menu,
  Moon,
  Package,
  Palette,
  Sun,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTheme } from "@/contexts/ThemeContext";

const menuItems = [
  { name: "Pedidos", href: "/dashboard", icon: ClipboardList },
  { name: "Categorias", href: "/categories", icon: ListPlus },
  { name: "Produtos", href: "/products", icon: Package },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, setPrimaryColor } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const primaryColors = [
    { name: "Laranja", color: "#ea580c", hover: "#c2410c" },
    { name: "Azul", color: "#2563eb", hover: "#1d4ed8" },
    { name: "Verde", color: "#16a34a", hover: "#15803d" },
  ];

  async function handleLogout() {
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
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
                onClick={onNavigate}
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
        <div className="relative">
          <button
            type="button"
            aria-expanded={isThemeMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsThemeMenuOpen((isOpen) => !isOpen)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Palette size={18} />
            Aparência
          </button>

          {isThemeMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-52 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Cor principal
              </p>
              <div className="grid grid-cols-3 gap-2">
                {primaryColors.map((primary) => (
                  <button
                    key={primary.name}
                    type="button"
                    role="menuitem"
                    aria-label={`Usar cor ${primary.name}`}
                    title={primary.name}
                    onClick={() => setPrimaryColor(primary.color, primary.hover)}
                    className="h-8 rounded-md border-2 border-transparent transition-transform hover:scale-105 focus:border-zinc-900 focus:outline-none dark:focus:border-white"
                    style={{ backgroundColor: primary.color }}
                  />
                ))}
              </div>
              <div className="my-3 border-t border-zinc-200 dark:border-zinc-700" />
              <button
                type="button"
                role="menuitem"
                onClick={toggleTheme}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center border-b border-zinc-200 bg-zinc-100 px-4 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          className="mr-3 rounded-md p-2 text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-primary">OrderFlow</h2>
      </header>

      <aside className="hidden min-h-screen w-64 flex-col justify-between border-r border-zinc-200 bg-zinc-100 p-4 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 md:flex">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`relative flex min-h-screen w-64 flex-col justify-between border-r border-zinc-200 bg-zinc-100 p-4 text-zinc-900 shadow-xl transition-transform dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
            className="absolute right-3 top-3 rounded-md p-2 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
          <SidebarContent onNavigate={() => setIsOpen(false)} />
        </aside>
      </div>
    </>
  );
}