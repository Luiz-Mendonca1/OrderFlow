"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, UserPlus, Users } from "lucide-react";
import { api } from "@/app/lib/api";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
};

export function TeamMembers({ initialMembers, token }: { initialMembers: TeamMember[]; token?: string }) {
  const [members, setMembers] = useState(initialMembers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api("/team", {
        method: "POST",
        token,
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as TeamMember & { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível cadastrar o membro.");
      setMembers((current) => [...current, result]);
      setName("");
      setEmail("");
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao cadastrar membro.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
    <form onSubmit={addMember} className="h-fit space-y-5 border-b border-border pb-7 lg:border-b-0 lg:border-r lg:pr-8">
      <div><h2 className="text-lg font-semibold text-foreground">Novo membro</h2><p className="mt-1 text-sm text-muted">O acesso será criado como STAFF nesta empresa.</p></div>
      <label className="block text-sm font-medium text-foreground">Nome<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
      <label className="block text-sm font-medium text-foreground">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
      <label className="block text-sm font-medium text-foreground">Senha temporária<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
      <label className="block text-sm font-medium text-foreground">Permissão<select disabled value="STAFF" className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"><option value="STAFF">STAFF</option></select></label>
      {error && <p role="alert" className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><UserPlus size={17} />{loading ? <><LoaderCircle className="animate-spin" size={16} /> Cadastrando...</> : "Cadastrar STAFF"}</button>
    </form>

    <section>
      <div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-foreground">Membros cadastrados</h2><p className="mt-1 text-sm text-muted">{members.length} acessos nesta empresa</p></div><Users size={20} className="text-muted" /></div>
      {members.length ? <ul className="divide-y divide-border border-y border-border">{members.map((member) => <li key={member.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate font-medium text-foreground">{member.name}</p><p className="truncate text-sm text-muted">{member.email}</p></div><span className="shrink-0 rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted">{member.role}</span></li>)}</ul> : <div className="border-y border-dashed border-border py-12 text-center text-sm text-muted">Nenhum membro cadastrado.</div>}
    </section>
  </div>;
}