"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";


export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await registerAction(null, formData);
      if (!result.success) throw new Error(result.error);
      router.push(result.redirectTo || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Criar <span className="text-primary">Conta</span>
          </h1>
          <p className="text-sm text-muted">Preencha os campos para começar</p>
        </div>

        {error && (
          <div className="p-3 text-sm rounded-lg bg-danger/10 border border-danger/20 text-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="organizationName">
              Nome do Estabelecimento
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              required
              minLength={2}
              placeholder="Ex.: Pizzaria da Praça"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="name">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Pelo menos 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Já possui uma conta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}