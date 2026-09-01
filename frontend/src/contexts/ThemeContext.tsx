"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setPrimaryColor: (colorHex: string, hoverHex: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("@app:theme") as Theme | null;
    const initialTheme = savedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("@app:theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  // Permite mudar a cor primária em tempo de execução via JS
  const setPrimaryColor = (colorHex: string, hoverHex: string) => {
    document.documentElement.style.setProperty("--primary", colorHex);
    document.documentElement.style.setProperty("--primary-hover", hoverHex);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};