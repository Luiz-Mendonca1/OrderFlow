"use client";

import { ChangeEvent, DragEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { Box, CalendarDays, ImagePlus, LoaderCircle, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

type Category = { id: string; name: string };
type Product = { id: string; name: string; description: string; price: number; banner: string; disabled: boolean; categoryId: string; category?: Category; createdAt: string };
type ModalMode = "details" | "create" | "edit";
type FormState = { name: string; description: string; price: string; category_id: string; file: File | null };

const emptyForm: FormState = { name: "", description: "", price: "", category_id: "", file: null };

export function ProductList({ products: initialProducts, categories: initialCategories, token }: { products: Product[]; categories: Category[]; token?: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = form.file ? URL.createObjectURL(form.file) : selectedProduct?.banner || "";

  useEffect(() => {
    if (!modalMode) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        setModalMode(null);
        setSelectedProduct(null);
        setError("");
        setForm(emptyForm);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalMode, isLoading]);

  async function refresh() {
    setIsRefreshing(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([api("/product", { token }), api("/category", { token })]);
      if (!productsResponse.ok || !categoriesResponse.ok) throw new Error("Não foi possível atualizar os produtos.");
      setProducts((await productsResponse.json()) as Product[]);
      setCategories((await categoriesResponse.json()) as Category[]);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Não foi possível atualizar os produtos.");
    } finally {
      setIsRefreshing(false);
    }
  }

  function closeModal() {
    if (isLoading) return;
    setModalMode(null);
    setSelectedProduct(null);
    setError("");
    setForm(emptyForm);
  }

  function openCreate() {
    setForm(emptyForm);
    setSelectedProduct(null);
    setError("");
    setModalMode("create");
  }

  function openDetails(product: Product) {
    setSelectedProduct(product);
    setError("");
    setModalMode("details");
  }

  function openEdit() {
    if (!selectedProduct) return;
    setForm({ name: selectedProduct.name, description: selectedProduct.description, price: String(selectedProduct.price), category_id: selectedProduct.categoryId, file: null });
    setError("");
    setModalMode("edit");
  }

  function updateField(field: keyof FormState, value: string | File | null) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      setError(file ? "Selecione um arquivo de imagem válido." : "");
      return;
    }
    setError("");
    updateField("file", file);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0] ?? null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.price || !form.category_id) {
      setError("Preencha nome, descrição, preço e categoria.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("description", form.description.trim());
      body.append("price", form.price);
      body.append("category_id", form.category_id);
      if (modalMode === "edit" && selectedProduct) body.append("id", selectedProduct.id);
      if (form.file) body.append("file", form.file);
      const response = await api("/product", { method: modalMode === "edit" ? "PUT" : "POST", token, body });
      if (!response.ok) throw new Error(await getApiError(response, "Não foi possível salvar o produto."));
      await refresh();
      setModalMode(null);
      setSelectedProduct(null);
      setForm(emptyForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar o produto.");
    } finally {
      setIsLoading(false);
    }
  }

  async function remove() {
    if (!selectedProduct || !window.confirm(`Excluir o produto "${selectedProduct.name}"?`)) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await api(`/product?product_id=${encodeURIComponent(selectedProduct.id)}`, { method: "DELETE", token });
      if (!response.ok) throw new Error(await getApiError(response, "Não foi possível excluir o produto."));
      await refresh();
      setModalMode(null);
      setSelectedProduct(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Não foi possível excluir o produto.");
    } finally {
      setIsLoading(false);
    }
  }

  const isForm = modalMode === "create" || modalMode === "edit";

  return <>
    <div className="flex items-center justify-between gap-4"><p className="text-sm text-muted">{products.length} {products.length === 1 ? "produto cadastrado" : "produtos cadastrados"}</p><button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"><Plus size={18} /> Novo Produto</button></div>
    {isRefreshing && <p className="flex items-center gap-2 text-sm text-muted"><LoaderCircle className="animate-spin" size={15} /> Atualizando produtos...</p>}
    {products.length === 0 ? <section className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center"><Box className="mx-auto mb-3 text-muted" size={32} /><h2 className="font-semibold text-foreground">Nenhum produto encontrado</h2><p className="mt-1 text-sm text-muted">Os produtos cadastrados aparecerão aqui.</p></section> : <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <button key={product.id} type="button" onClick={() => openDetails(product)} className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"><div className="relative h-44 bg-background">{product.banner ? <img src={product.banner} alt={product.name} className="h-full w-full object-cover" /> : <Box className="absolute inset-0 m-auto text-muted" size={34} />}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="truncate text-lg font-semibold text-foreground">{product.name}</h2><span className="shrink-0 font-semibold text-primary">{formatPrice(product.price)}</span></div><p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p><p className="mt-4 flex items-center gap-2 text-sm text-muted"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{product.category?.name ?? "Sem categoria"}</span><CalendarDays size={14} /> {formatDate(product.createdAt)}</p></div></button>)}</section>}
    {modalMode && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8"><div><p className="text-sm font-semibold text-primary">{modalMode === "create" ? "Novo produto" : modalMode === "edit" ? "Editar produto" : "Detalhes do produto"}</p><h2 id="product-dialog-title" className="mt-1 text-2xl font-bold text-foreground">{isForm ? (modalMode === "create" ? "Cadastrar produto" : "Alterar produto") : selectedProduct?.name}</h2>{isForm && <p className="mt-1 text-sm text-muted">Adicione as informações que aparecerão no seu cardápio.</p>}</div><button type="button" onClick={closeModal} disabled={isLoading} aria-label="Fechar modal" className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground disabled:opacity-50"><X size={20} /></button></div>{isForm ? <form onSubmit={submit} className="space-y-6 px-6 py-6 sm:px-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Nome do produto" className="sm:col-span-2"><input autoFocus value={form.name} onChange={(event) => updateField("name", event.target.value)} disabled={isLoading} placeholder="Ex.: Pizza de calabresa" /></Field><Field label="Preço"><input type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} disabled={isLoading} placeholder="0,00" /></Field><Field label="Categoria"><select value={form.category_id} onChange={(event) => updateField("category_id", event.target.value)} disabled={isLoading}><option value="">Selecione uma categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field><Field label="Descrição" hint="Conte o que torna este produto especial." className="sm:col-span-2"><textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} disabled={isLoading} rows={3} placeholder="Ingredientes, tamanho e outras informações" /></Field></div><div><div className="mb-2 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-foreground">Imagem do produto</h3><p className="mt-1 text-xs text-muted">Opcional. JPG, PNG ou WEBP de até 5 MB.</p></div><ImagePlus size={19} className="text-primary" /></div><label onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`relative flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-5 py-6 text-center transition ${isDragging ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary hover:bg-primary/5"}`}>{previewUrl ? <><img src={previewUrl} alt="Prévia do produto" className="absolute inset-0 h-full w-full object-cover opacity-45" /><span className="relative rounded-lg bg-card/90 px-4 py-2 text-sm font-semibold text-foreground">{form.file ? "Trocar imagem" : "Escolher outra imagem"}</span></> : <><Upload size={25} className="text-primary" /><span className="mt-3 text-sm font-semibold text-foreground">Arraste uma imagem ou clique para escolher</span><span className="mt-1 text-xs text-muted">A imagem é opcional</span></>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} disabled={isLoading} className="hidden" /></label></div><ModalError message={error} /><Actions onCancel={closeModal} loading={isLoading} submitLabel={modalMode === "create" ? "Salvar Produto" : "Salvar Alterações"} /></form> : <><div className="mx-6 mt-6 overflow-hidden rounded-xl bg-background sm:mx-8">{selectedProduct?.banner ? <img src={selectedProduct.banner} alt={selectedProduct.name} className="max-h-64 w-full object-cover" /> : <div className="flex h-40 items-center justify-center text-muted"><Box size={40} /></div>}</div><dl className="mx-6 mt-5 space-y-3 border-t border-border pt-4 text-sm sm:mx-8"><Row label="Preço">{selectedProduct && formatPrice(selectedProduct.price)}</Row><Row label="Categoria">{selectedProduct?.category?.name ?? "Sem categoria"}</Row><Row label="Descrição">{selectedProduct?.description}</Row></dl><ModalError message={error} /><div className="flex justify-end gap-3 px-6 py-6 sm:px-8"><button type="button" onClick={remove} disabled={isLoading} className="flex items-center gap-2 rounded-lg border border-danger px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 disabled:opacity-60"><Trash2 size={16} />{isLoading ? "Excluindo..." : "Excluir"}</button><button type="button" onClick={openEdit} disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"><Pencil size={16} /> Editar</button></div></>}</section></div>}
  </>;
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return <label className={`block text-sm font-medium text-foreground ${className}`}><span>{label}</span><div className="mt-2 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-border [&_input]:bg-background [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-foreground [&_input]:outline-none [&_input]:transition [&_input]:placeholder:text-muted [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-border [&_select]:bg-background [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-foreground [&_select]:outline-none [&_select]:transition [&_select]:focus:border-primary [&_select]:focus:ring-2 [&_select]:focus:ring-primary/20 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-background [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-foreground [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:placeholder:text-muted [&_textarea]:focus:border-primary [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-primary/20">{children}</div>{hint && <span className="mt-1.5 block text-xs font-normal text-muted">{hint}</span>}</label>;
}

function Actions({ onCancel, loading, submitLabel }: { onCancel: () => void; loading: boolean; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background disabled:opacity-60">Cancelar</button><button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60">{loading && <LoaderCircle className="animate-spin" size={16} />}{loading ? "Salvando..." : submitLabel}</button></div>;
}

function Row({ label, children }: { label: string; children: ReactNode }) { return <div className="flex justify-between gap-4"><dt className="text-muted">{label}</dt><dd className="max-w-[70%] text-right font-medium text-foreground">{children}</dd></div>; }
function ModalError({ message }: { message: string }) { return message ? <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{message}</p> : null; }
async function getApiError(response: Response, fallback: string) { try { const body = (await response.json()) as { error?: string; message?: string }; return body.error || body.message || fallback; } catch { return fallback; } }
function formatPrice(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }
function formatDate(value: string) { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value)); }
