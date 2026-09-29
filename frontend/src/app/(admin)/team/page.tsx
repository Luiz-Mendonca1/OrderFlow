import { Users } from "lucide-react";
import { api } from "@/app/lib/api";
import { getAuthToken } from "@/app/lib/auth";
import { requiredAdmin } from "@/lib/auth";
import { TeamMembers, TeamMember } from "./TeamMembers";

export default async function TeamPage() {
  await requiredAdmin();
  const token = await getAuthToken();
  const response = await api("/team", { token });
  if (!response.ok) throw new Error("Não foi possível carregar a equipe.");
  const members = (await response.json()) as TeamMember[];

  return <div className="mx-auto w-full max-w-5xl space-y-8">
    <header className="border-b border-border pb-6">
      <p className="flex items-center gap-2 text-sm font-medium text-primary"><Users size={16} /> Administração</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Equipe</h1>
      <p className="mt-2 text-muted">Cadastre acessos para sua equipe.</p>
    </header>
    <TeamMembers initialMembers={members} token={token} />
  </div>;
}