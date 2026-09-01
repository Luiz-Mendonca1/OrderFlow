"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme, toggleTheme, setPrimaryColor } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tema Dinâmico</h1>
          <p className="text-sm text-muted">
            Tema atual: <span className="font-semibold text-primary">{theme}</span>
          </p>
        </div>

        {/* Botão de Alternar Light / Dark */}
        <button
          onClick={toggleTheme}
          className="w-full py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Alternar para modo {theme === "light" ? "Escuro" : "Claro"}
        </button>

        {/* Troca Dinâmica da Cor Primária em Runtime */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Mudar cor de destaque (Primary):
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPrimaryColor("#ea580c", "#c2410c")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-orange-600 text-white"
            >
              Laranja
            </button>
            <button
              onClick={() => setPrimaryColor("#2563eb", "#1d4ed8")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-blue-600 text-white"
            >
              Azul
            </button>
            <button
              onClick={() => setPrimaryColor("#16a34a", "#15803d")}
              className="flex-1 py-1.5 text-xs font-medium rounded bg-green-600 text-white"
            >
              Verde
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}