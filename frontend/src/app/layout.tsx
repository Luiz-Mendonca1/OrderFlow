import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrderFlow",
  description: "Gerenciamento de pedidos",
};

const themeInitializerScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('@app:theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      var savedPrimary = localStorage.getItem('@app:primary');
      if (savedPrimary) {
        var primary = JSON.parse(savedPrimary);
        if (typeof primary.color === 'string' && typeof primary.hover === 'string') {
          document.documentElement.style.setProperty('--primary', primary.color);
          document.documentElement.style.setProperty('--primary-hover', primary.hover);
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}