"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

type PrimaryColor = {
  color: string;
  hover: string;
};

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

    const savedPrimary = localStorage.getItem("@app:primary");
    if (savedPrimary) {
      try {
        const primary = JSON.parse(savedPrimary) as Partial<PrimaryColor>;
        if (typeof primary.color === "string" && typeof primary.hover === "string") {
          document.documentElement.style.setProperty("--primary", primary.color);
          document.documentElement.style.setProperty("--primary-hover", primary.hover);
        }
      } catch {
        localStorage.removeItem("@app:primary");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("@app:theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const setPrimaryColor = (colorHex: string, hoverHex: string) => {
    document.documentElement.style.setProperty("--primary", colorHex);
    document.documentElement.style.setProperty("--primary-hover", hoverHex);
    localStorage.setItem(
      "@app:primary",
      JSON.stringify({ color: colorHex, hover: hoverHex })
    );
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