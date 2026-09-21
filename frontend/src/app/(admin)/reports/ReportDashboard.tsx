"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, Download, FileText, Receipt, ShoppingBag, Trophy, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ReportOrderItem = { amount: number; product: { name: string; price: number } };
export type ReportOrder = { id: string; table: number | null; name: string | null; status: boolean | string | null; createdAt: string; items: ReportOrderItem[] };
type PeriodMode = "month" | "custom";

type Period = { mode: PeriodMode; month: number; year: number; start: string; end: string };

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function ReportDashboard({ orders }: { orders: ReportOrder[] }) {
  const today = new Date();
  const availableYears = getAvailableYears(orders);
  const [period, setPeriod] = useState<Period>({ mode: "month", month: today.getMonth(), year: today.getFullYear(), start: toInputDate(new Date(today.getFullYear(), today.getMonth(), 1)), end: toInputDate(today) });
  const filteredOrders = useMemo(() => filterOrders(orders, period), [orders, period]);
  const totalRevenue = filteredOrders.reduce((total, order) => total + getTotal(order), 0);
  const averageTicket = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
  const topProduct = getTopProduct(filteredOrders);
  const chartData = useMemo(() => getChartData(filteredOrders), [filteredOrders]);

  function setMonth(month: number) {
    const year = period.year;
    setPeriod({ mode: "month", month, year, start: toInputDate(new Date(year, month, 1)), end: toInputDate(new Date(year, month + 1, 0)) });
  }

  function setYear(year: number) {
    setPeriod((current) => ({ ...current, mode: "month", year, start: toInputDate(new Date(year, current.month, 1)), end: toInputDate(new Date(year, current.month + 1, 0)) }));
  }

  function exportCsv() {
    const header = ["ID do Pedido", "Data/Hora", "Mesa/Cliente", "Produtos Vendidos", "Quantidade Total", "Valor Total", "Status"];
    const rows = filteredOrders.map((order) => [
      cleanCsvValue(order.id),
      formatCsvDate(order.createdAt),
      cleanCsvValue(order.table ? `Mesa ${order.table}` : order.name || "Não informado"),
      cleanCsvValue(order.items.map((item) => `${item.amount}x ${item.product.name} (${formatNumber(item.product.price)})`).join(" + ")),
      String(order.items.reduce((total, item) => total + item.amount, 0)),
      formatNumber(getTotal(order)),
      "Concluido",
    ]);
    const csv = `\ufeffsep=;\r\n${[header, ...rows].map((row) => row.join(";")).join("\r\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-pedidos-${periodLabel(period).toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <div className="space-y-8">
    <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="flex items-center gap-2 text-sm font-medium text-primary"><BarChart3 size={16} /> Análise financeira</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Relatórios</h1><p className="mt-2 text-muted">Acompanhe o desempenho dos pedidos concluídos.</p></div>
      <button type="button" onClick={exportCsv} disabled={!filteredOrders.length} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"><Download size={17} /> Exportar CSV</button>
    </header>

  <PeriodFilters period={period} years={availableYears} onModeChange={(mode) => setPeriod((current) => ({ ...current, mode }))} onMonthChange={setMonth} onYearChange={setYear} onStartChange={(start) => setPeriod((current) => ({ ...current, mode: "custom", start }))} onEndChange={(end) => setPeriod((current) => ({ ...current, mode: "custom", end }))} />

    <section className="grid gap-4 md:grid-cols-3"><KpiCard label="Faturamento total" value={formatCurrency(totalRevenue)} detail={`${filteredOrders.length} pedidos no período`} icon={<Receipt size={20} />} /><KpiCard label="Pedidos concluídos" value={String(filteredOrders.length)} detail="Pedidos finalizados" icon={<ShoppingBag size={20} />} /><KpiCard label="Ticket médio" value={formatCurrency(averageTicket)} detail="Valor médio por pedido" icon={<FileText size={20} />} /></section>
    <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]"><div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-foreground">Faturamento no período</h2><p className="mt-1 text-sm text-muted">Pedidos concluídos agrupados por dia.</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{periodLabel(period)}</span></div><div className="h-80 w-full">{chartData.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} tickFormatter={(value) => `R$ ${value}`} /><Tooltip cursor={{ fill: "var(--background)" }} formatter={(value) => [formatCurrency(Number(value)), "Faturamento"]} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--foreground)" }} /><Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer> : <NoData />}</div></div><div className="space-y-4"><SummaryCard label="Produto mais vendido" icon={<Trophy size={19} />}><p className="text-lg font-bold text-foreground">{topProduct?.name ?? "Sem dados"}</p><p className="mt-1 text-sm text-muted">{topProduct ? `${topProduct.amount} unidades vendidas` : "Nenhum item no período"}</p></SummaryCard><SummaryCard label="Formas de pagamento" icon={<WalletCards size={19} />}><p className="text-sm font-medium text-foreground">Dados não disponíveis</p><p className="mt-1 text-xs text-muted">O cadastro de pedidos ainda não armazena a forma de pagamento.</p></SummaryCard></div></section>
    {!filteredOrders.length && <div className="rounded-lg border border-dashed border-border bg-card px-4 py-3 text-center text-sm text-muted">Não existem pedidos concluídos no período selecionado.</div>}
  </div>;
}

function PeriodFilters({ period, years, onModeChange, onMonthChange, onYearChange, onStartChange, onEndChange }: { period: Period; years: number[]; onModeChange: (mode: PeriodMode) => void; onMonthChange: (month: number) => void; onYearChange: (year: number) => void; onStartChange: (value: string) => void; onEndChange: (value: string) => void }) {
  return <section className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays size={17} className="text-primary" /> Período do relatório</p><p className="mt-1 text-xs text-muted">As métricas e o gráfico são atualizados automaticamente.</p></div><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><label className="flex items-center gap-2 text-sm font-medium text-foreground"><span className="text-muted">Visualizar</span><select value={period.mode} onChange={(event) => onModeChange(event.target.value as PeriodMode)} className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"><option value="month">Mês / Ano</option><option value="custom">Intervalo personalizado</option></select></label>{period.mode === "month" ? <><select aria-label="Mês" value={period.month} onChange={(event) => onMonthChange(Number(event.target.value))} className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">{monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}</select><select aria-label="Ano" value={period.year} onChange={(event) => onYearChange(Number(event.target.value))} className="rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></> : <><label className="text-sm text-muted">Inicial<input type="date" value={period.start} onChange={(event) => onStartChange(event.target.value)} className="ml-2 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="text-sm text-muted">Final<input type="date" value={period.end} onChange={(event) => onEndChange(event.target.value)} className="ml-2 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label></>}</div></div></section>;
}

function KpiCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) { return <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-muted">{label}</p><span className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</span></div><p className="mt-5 text-2xl font-bold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted">{detail}</p></article>; }
function SummaryCard({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) { return <article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-semibold text-foreground"><span className="text-primary">{icon}</span>{label}</div><div className="mt-5">{children}</div></article>; }
function NoData() { return <div className="flex h-full flex-col items-center justify-center text-center text-muted"><BarChart3 size={32} /><p className="mt-3 text-sm">Nenhum pedido concluído neste período.</p></div>; }
function isFinished(status: ReportOrder["status"]) { return status === true || ["FINALIZADO", "CONCLUIDO", "CONCLUÍDO"].includes(String(status).toUpperCase()); }
function filterOrders(orders: ReportOrder[], period: Period) { const start = new Date(`${period.start}T00:00:00`); const end = new Date(`${period.end}T23:59:59.999`); return orders.filter((order) => isFinished(order.status) && new Date(order.createdAt) >= start && new Date(order.createdAt) <= end); }
function getTotal(order: ReportOrder) { return order.items.reduce((total, item) => total + item.amount * item.product.price, 0); }
function getTopProduct(orders: ReportOrder[]) { const products = new Map<string, number>(); orders.flatMap((order) => order.items).forEach((item) => products.set(item.product.name, (products.get(item.product.name) ?? 0) + item.amount)); const top = [...products.entries()].sort(([, first], [, second]) => second - first)[0]; return top ? { name: top[0], amount: top[1] } : null; }
function getChartData(orders: ReportOrder[]) { const grouped = new Map<string, number>(); orders.forEach((order) => { const date = new Date(order.createdAt); const key = date.toISOString().slice(0, 10); grouped.set(key, (grouped.get(key) ?? 0) + getTotal(order)); }); return [...grouped.entries()].sort(([first], [second]) => first.localeCompare(second)).map(([date, revenue]) => ({ label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${date}T12:00:00`)), revenue: Number(revenue.toFixed(2)) })); }
function periodLabel(period: Period) { return period.mode === "month" ? `${monthNames[period.month]} ${period.year}` : `${formatShortDate(period.start)} a ${formatShortDate(period.end)}`; }
function toInputDate(date: Date) { return date.toISOString().slice(0, 10); }
function formatShortDate(value: string) { return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`)); }
function formatCurrency(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }
function formatNumber(value: number) { return value.toFixed(2).replace(".", ","); }
function getAvailableYears(orders: ReportOrder[]) { const currentYear = new Date().getFullYear(); const years = orders.length ? orders.map((order) => new Date(order.createdAt).getFullYear()) : [currentYear]; const firstYear = Math.min(...years, currentYear); return Array.from({ length: currentYear - firstYear + 1 }, (_, index) => firstYear + index); }
function cleanCsvValue(value: string) { return value.replace(/[\r\n]+/g, " ").replaceAll('"', "").replaceAll(";", "").replace(/\s+/g, " ").trim(); }
function formatCsvDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(value)).replace(",", ""); }
