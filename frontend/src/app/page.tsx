"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme, setPrimaryColor } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("@app:token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("@app:token");
    localStorage.removeItem("@app:user");
    document.cookie = "@app:token=; path=/; max-age=0";
    router.push("/login");
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tema Dinâmico</h1>
          <p className="text-sm text-muted">
            Tema atual: <span className="font-semibold text-primary">{theme}</span>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Alternar para modo {theme === "light" ? "Escuro" : "Claro"}
        </button>

        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Mudar cor de destaque (Primary):
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPrimaryColor("#ea580c", "#c2410c")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-orange-600 text-white cursor-pointer"
            >
              Laranja
            </button>
            <button
              onClick={() => setPrimaryColor("#2563eb", "#1d4ed8")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-blue-600 text-white cursor-pointer"
            >
              Azul
            </button>
            <button
              onClick={() => setPrimaryColor("#16a34a", "#15803d")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-green-600 text-white cursor-pointer"
            >
              Verde
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center text-sm"
          >
            Ver Pedidos
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-lg font-medium border border-border text-foreground hover:bg-danger/10 hover:text-danger hover:border-danger transition-colors cursor-pointer text-sm"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </main>
  );
}