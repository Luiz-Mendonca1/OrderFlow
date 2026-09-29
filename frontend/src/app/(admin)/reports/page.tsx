import { Suspense } from "react";
import { api } from "@/app/lib/api";
import { getAuthToken } from "@/app/lib/auth";
import { requiredAdmin } from "@/lib/auth";
import { ReportDashboard, ReportOrder } from "./ReportDashboard";

export default function ReportsPage() {
  return <div className="mx-auto w-full max-w-6xl"><Suspense fallback={<ReportsLoading />}><ReportsContent /></Suspense></div>;
}

async function ReportsContent() {
  await requiredAdmin();
  const token = await getAuthToken();
  const response = await api("/order", { token });
  if (!response.ok) throw new Error("Não foi possível carregar os dados dos relatórios.");
  const orders = (await response.json()) as ReportOrder[];
  return <ReportDashboard orders={orders} />;
}

function ReportsLoading() {
  return <section className="space-y-6"><div className="h-28 animate-pulse rounded-xl border border-border bg-card" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl border border-border bg-card" />)}</div><div className="h-96 animate-pulse rounded-xl border border-border bg-card" /></section>;
}
