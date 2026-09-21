"use client";

import { ReactNode, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { CheckCircle2, Clock3, Hash, LoaderCircle, RefreshCw, ShoppingBag, UserRound, X } from "lucide-react";

export type OrderItem = { id: string; amount: number; product: { id: string; name: string; price: number } };
export type Order = { id: string; table: number | null; name: string | null; draft: boolean; status: boolean | string | null; createdAt: string; items: OrderItem[] };

type Props = { initialOrders: Order[]; token?: string };

export function OrderDashboard({ initialOrders, token }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!selectedOrder) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isFinishing) setSelectedOrder(null);
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedOrder, isFinishing]);

  async function refreshOrders() {
    setIsRefreshing(true);
    setError("");
    try {
      const response = await api("/order", { token });
      if (!response.ok) throw new Error("Não foi possível atualizar os pedidos.");
      const refreshedOrders = (await response.json()) as Order[];
      setOrders(refreshedOrders.filter((order) => !isFinished(order.status)));
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Não foi possível atualizar os pedidos.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function openOrder(order: Order) {
    setSelectedOrder(order);
    setIsLoadingDetail(true);
    setError("");
    try {
      const response = await api(`/order/detail?orderId=${encodeURIComponent(order.id)}`, { token });
      if (!response.ok) throw new Error("Não foi possível carregar os detalhes do pedido.");
      setSelectedOrder((await response.json()) as Order);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Não foi possível carregar os detalhes do pedido.");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function finishOrder() {
    if (!selectedOrder || isFinished(selectedOrder.status)) return;
    setIsFinishing(true);
    setError("");
    try {
      const response = await api("/order/finish", {
        method: "PUT",
        token,
        body: JSON.stringify({ orderId: selectedOrder.id }),
      });
      if (!response.ok) throw new Error(await getApiError(response, "Não foi possível finalizar o pedido."));
      const finishedOrderId = selectedOrder.id;
      setOrders((current) => current.filter((order) => order.id !== finishedOrderId));
      setSelectedOrder(null);
      setSuccessMessage("Pedido concluído com sucesso.");
      window.setTimeout(() => setSuccessMessage(""), 3500);
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : "Não foi possível finalizar o pedido.");
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <>
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><ShoppingBag size={16} /> Operação</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Pedidos</h1>
          <p className="mt-2 text-muted">Acompanhe e conclua os pedidos recebidos.</p>
        </div>
        <button type="button" onClick={refreshOrders} disabled={isRefreshing} className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60">
          <RefreshCw size={17} className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? "Atualizando..." : "Atualizar"}
        </button>
      </header>
      {error && <p role="alert" className="mt-5 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {successMessage && <div role="status" className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-lg border border-success/30 bg-card px-4 py-3 text-sm font-semibold text-success shadow-lg"><CheckCircle2 size={18} />{successMessage}</div>}
      {orders.length === 0 ? <EmptyOrders /> : <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{orders.map((order) => <OrderCard key={order.id} order={order} onClick={() => openOrder(order)} />)}</section>}
      {selectedOrder && <OrderModal order={selectedOrder} loading={isLoadingDetail} finishing={isFinishing} error={error} onClose={() => !isFinishing && setSelectedOrder(null)} onFinish={finishOrder} />}
    </>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const quantity = order.items.reduce((total, item) => total + item.amount, 0);
  return (
    <button type="button" onClick={onClick} className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">
      <div className="flex items-start justify-between gap-3"><span className="flex items-center gap-2 text-sm font-semibold text-primary"><Hash size={15} />{order.id.slice(0, 8).toUpperCase()}</span><StatusBadge order={order} /></div>
      <div className="mt-6 grid grid-cols-2 gap-4"><Info label="Mesa / cliente" value={order.table ? `Mesa ${order.table}` : order.name || "Cliente não informado"} icon={<UserRound size={15} />} /><Info label="Itens" value={`${quantity} ${quantity === 1 ? "item" : "itens"}`} icon={<ShoppingBag size={15} />} /></div>
      <div className="mt-5 flex items-end justify-between border-t border-border pt-4"><div><p className="text-xs text-muted">Total do pedido</p><p className="mt-1 text-lg font-bold text-foreground">{formatPrice(getTotal(order))}</p></div><span className="text-xs font-medium text-muted">{formatDate(order.createdAt)}</span></div>
    </button>
  );
}

function OrderModal({ order, loading, finishing, error, onClose, onFinish }: { order: Order; loading: boolean; finishing: boolean; error: string; onClose: () => void; onFinish: () => void }) {
  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="order-dialog-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8"><div><p className="flex items-center gap-2 text-sm font-semibold text-primary"><Hash size={15} /> Pedido {order.id.slice(0, 8).toUpperCase()}</p><h2 id="order-dialog-title" className="mt-1 text-2xl font-bold text-foreground">Detalhes do pedido</h2><p className="mt-1 text-sm text-muted">{order.table ? `Mesa ${order.table}` : order.name || "Cliente não informado"}</p></div><button type="button" onClick={onClose} disabled={finishing} aria-label="Fechar detalhes" className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground disabled:opacity-50"><X size={20} /></button></header>
        <div className="space-y-5 px-6 py-6 sm:px-8">
          {loading ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted"><LoaderCircle size={18} className="animate-spin" /> Carregando itens...</div> : <><div className="divide-y divide-border rounded-xl border border-border">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><p className="truncate font-semibold text-foreground">{item.product.name}</p><p className="mt-1 text-sm text-muted">{item.amount} x {formatPrice(item.product.price)}</p></div><p className="shrink-0 font-semibold text-foreground">{formatPrice(item.amount * item.product.price)}</p></div>)}</div><div className="flex items-center justify-between border-t border-border pt-5"><span className="font-medium text-muted">Total do pedido</span><span className="text-2xl font-bold text-primary">{formatPrice(getTotal(order))}</span></div></>}
          {error && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={finishing} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-background disabled:opacity-60">Fechar</button><button type="button" onClick={onFinish} disabled={loading || finishing || isFinished(order.status)} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">{finishing && <LoaderCircle size={16} className="animate-spin" />}{isFinished(order.status) ? "Pedido finalizado" : finishing ? "Finalizando..." : "Concluir / Finalizar Pedido"}</button></div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ order }: { order: Order }) { return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${order.status ? "bg-success/10 text-success" : order.draft ? "bg-background text-muted" : "bg-primary/10 text-primary"}`}>{order.status ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}{order.status ? "Finalizado" : order.draft ? "Rascunho" : "Em aberto"}</span>; }
function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) { return <div><p className="flex items-center gap-1.5 text-xs text-muted">{icon}{label}</p><p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p></div>; }
function EmptyOrders() { return <section className="mt-8 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"><ShoppingBag className="mx-auto mb-3 text-muted" size={34} /><h2 className="font-semibold text-foreground">Nenhum pedido encontrado</h2><p className="mt-1 text-sm text-muted">Os novos pedidos aparecerão aqui.</p></section>; }
function getTotal(order: Order) { return order.items.reduce((total, item) => total + item.amount * item.product.price, 0); }
function isFinished(status: Order["status"]) { return status === true || ["FINALIZADO", "CONCLUIDO", "CONCLUÍDO"].includes(String(status).toUpperCase()); }
function formatPrice(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }
function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }
async function getApiError(response: Response, fallback: string) { try { const body = (await response.json()) as { error?: string; message?: string }; return body.error || body.message || fallback; } catch { return fallback; } }
