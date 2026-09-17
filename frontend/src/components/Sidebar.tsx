"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ListPlus, Package, LogOut } from "lucide-react";

const menuItems = [
  { name: "Pedidos", href: "/dashboard", icon: ClipboardList },
  { name: "Categorias", href: "/categories", icon: ListPlus },
  { name: "Produtos", href: "/products", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-100 min-h-screen p-4 flex flex-col justify-between border-r border-zinc-800">
      <div className="space-y-6">
        {/* Nome do Sistema */}
        <div className="px-2">
          <h2 className="text-xl font-bold tracking-tight text-emerald-500">
            OrderFlow
          </h2>
          <p className="text-xs text-zinc-500">Painel Administrativo</p>
        </div>

        {/* Navegação */}
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
                    ? "bg-zinc-800 text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botão para Deslogar */}
      <button
        onClick={() => {
          // Remove o cookie do token no navegador
          document.cookie = "@app:token=; path=/; max-age=0";
          window.location.href = "/login";
        }}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
      >
        <LogOut size={18} />
        Sair da conta
      </button>
    </aside>
  );
}