"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { CalendarDays, FolderOpen, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";

type Category = { id: string; name: string; createdAt: string };
type ModalMode = "details" | "create" | "edit";

export function CategoryList({ categories: initialCategories, token }: { categories: Category[]; token?: string }) {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modalMode) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        setModalMode(null);
        setSelectedCategory(null);
        setError("");
      }
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [modalMode, isLoading]);

  async function refreshCategories() {
    setIsRefreshing(true);
    try {
      const response = await api("/category", { token });
      if (!response.ok) throw new Error("Não foi possível atualizar as categorias.");
      setCategories((await response.json()) as Category[]);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Não foi possível atualizar as categorias.");
    } finally { setIsRefreshing(false); }
  }

  function openCreateModal() { setSelectedCategory(null); setName(""); setError(""); setModalMode("create"); }
  function openDetails(category: Category) { setSelectedCategory(category); setError(""); setModalMode("details"); }
  function openEditModal() { if (!selectedCategory) return; setName(selectedCategory.name); setError(""); setModalMode("edit"); }
  function closeModal() { if (isLoading) return; setModalMode(null); setSelectedCategory(null); setError(""); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { setError("Informe o nome da categoria."); return; }
    setIsLoading(true); setError("");
    try {
      const isEditing = modalMode === "edit";
      const response = await api("/category", { method: isEditing ? "PUT" : "POST", token, body: JSON.stringify(isEditing ? { id: selectedCategory?.id, name: trimmedName } : { name: trimmedName }) });
      if (!response.ok) throw new Error(await getApiError(response, "Não foi possível salvar a categoria."));
      await refreshCategories();
      setModalMode(null);
      setSelectedCategory(null);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar a categoria."); }
    finally { setIsLoading(false); }
  }

  async function handleDelete() {
    if (!selectedCategory || !window.confirm(`Excluir a categoria "${selectedCategory.name}"?`)) return;
    setIsLoading(true); setError("");
    try {
      const response = await api(`/category?category_id=${encodeURIComponent(selectedCategory.id)}`, { method: "DELETE", token });
      if (!response.ok) throw new Error(await getApiError(response, "Não foi possível excluir a categoria."));
      await refreshCategories();
      setModalMode(null);
      setSelectedCategory(null);
    } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir a categoria."); }
    finally { setIsLoading(false); }
  }

  const isForm = modalMode === "create" || modalMode === "edit";
  return <>
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted">{categories.length} {categories.length === 1 ? "categoria cadastrada" : "categorias cadastradas"}</p>
      <button type="button" onClick={openCreateModal} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"><Plus size={18} /> Nova Categoria</button>
    </div>
    {isRefreshing && <p className="flex items-center gap-2 text-sm text-muted"><LoaderCircle className="animate-spin" size={15} /> Atualizando categorias...</p>}
    {categories.length === 0 ? <section className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center"><FolderOpen className="mx-auto mb-3 text-muted" size={32} /><h2 className="font-semibold text-foreground">Nenhuma categoria encontrada</h2><p className="mt-1 text-sm text-muted">As categorias cadastradas aparecerão aqui.</p></section> : <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => <button key={category.id} type="button" onClick={() => openDetails(category)} className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"><div className="mb-8 flex items-start justify-between gap-4"><span className="rounded-lg bg-primary/10 p-2.5 text-primary"><FolderOpen size={20} /></span><span className="text-xs text-muted">Ver detalhes</span></div><h2 className="truncate text-lg font-semibold text-foreground">{category.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-muted"><CalendarDays size={15} /> Criada em {formatDate(category.createdAt)}</p></button>)}
    </section>}
    {modalMode && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section role="dialog" aria-modal="true" aria-labelledby="category-dialog-title" className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-primary">{modalMode === "create" ? "Nova categoria" : modalMode === "edit" ? "Editar categoria" : "Detalhes da categoria"}</p><h2 id="category-dialog-title" className="mt-1 text-2xl font-bold text-foreground">{isForm ? (modalMode === "create" ? "Cadastrar categoria" : "Alterar categoria") : selectedCategory?.name}</h2></div><button type="button" onClick={closeModal} disabled={isLoading} aria-label="Fechar modal" className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground disabled:opacity-50"><X size={20} /></button></div>
      {isForm ? <form onSubmit={handleSubmit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-foreground">Nome<input value={name} onChange={(event) => setName(event.target.value)} autoFocus disabled={isLoading} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><ModalError message={error} /><div className="flex justify-end gap-3"><button type="button" onClick={closeModal} disabled={isLoading} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground">Cancelar</button><button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{isLoading && <LoaderCircle className="animate-spin" size={16} />}{isLoading ? "Salvando..." : "Salvar"}</button></div></form> : <><dl className="mt-6 space-y-4 border-t border-border pt-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted">ID</dt><dd className="max-w-[70%] truncate text-right font-medium text-foreground" title={selectedCategory?.id}>{selectedCategory?.id}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted">Data de criação</dt><dd className="font-medium text-foreground">{selectedCategory && formatDate(selectedCategory.createdAt)}</dd></div></dl><ModalError message={error} /><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={handleDelete} disabled={isLoading} className="flex items-center gap-2 rounded-lg border border-danger px-4 py-2.5 text-sm font-semibold text-danger disabled:opacity-60"><Trash2 size={16} />{isLoading ? "Excluindo..." : "Excluir"}</button><button type="button" onClick={openEditModal} disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Pencil size={16} /> Editar</button></div></>}</section></div>}
  </>;
}

function ModalError({ message }: { message: string }) { return message ? <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{message}</p> : null; }
async function getApiError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { error?: string; message?: string };
    if (response.status === 403) return "Você precisa de um usuário administrador para realizar esta ação.";
    return body.error || body.message || fallback;
  } catch { return fallback; }
}
function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value)); }
