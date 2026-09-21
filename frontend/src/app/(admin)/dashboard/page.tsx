import { Suspense } from "react";
import { api } from "@/app/lib/api";
import { getAuthToken } from "@/app/lib/auth";
import { OrderDashboard, Order } from "./OrderDashboard";

export default function DashboardPage() {
  return <div className="mx-auto w-full max-w-6xl"><Suspense fallback={<DashboardLoading />}><DashboardContent /></Suspense></div>;
}

async function DashboardContent() {
  const token = await getAuthToken();
  const response = await api("/order", { token });
  if (!response.ok) throw new Error("Não foi possível carregar os pedidos.");
  const orders = (await response.json()) as Order[];
  return <OrderDashboard initialOrders={orders.filter((order) => !isFinished(order.status))} token={token} />;
}

function DashboardLoading() {
  return <section className="space-y-8"><div className="h-28 animate-pulse rounded-xl border border-border bg-card" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-52 animate-pulse rounded-xl border border-border bg-card" />)}</div></section>;
}

function isFinished(status: Order["status"]) {
  return status === true || ["FINALIZADO", "CONCLUIDO", "CONCLUÍDO"].includes(String(status).toUpperCase());
}
