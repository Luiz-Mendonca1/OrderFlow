"use client";

import { useEffect, useState } from "react";
import { CalendarDays, FolderOpen, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export function CategoryList({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!selectedCategory) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedCategory(null);
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedCategory]);

  if (categories.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <FolderOpen className="mx-auto mb-3 text-muted" size={32} />
        <h2 className="font-semibold text-foreground">Nenhuma categoria encontrada</h2>
        <p className="mt-1 text-sm text-muted">As categorias cadastradas aparecerão aqui.</p>
      </section>
    );
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <FolderOpen size={20} />
              </span>
              <span className="text-xs text-muted">Ver detalhes</span>
            </div>
            <h2 className="truncate text-lg font-semibold text-foreground">{category.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <CalendarDays size={15} />
              Criada em {formatDate(category.createdAt)}
            </p>
          </button>
        ))}
      </section>

      {selectedCategory && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCategory(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-dialog-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Detalhes da categoria</p>
                <h2 id="category-dialog-title" className="mt-1 text-2xl font-bold text-foreground">
                  {selectedCategory.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                aria-label="Fechar detalhes"
                className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <dl className="mt-6 space-y-4 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ID</dt>
                <dd className="max-w-[70%] truncate text-right font-medium text-foreground" title={selectedCategory.id}>
                  {selectedCategory.id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Data de criação</dt>
                <dd className="font-medium text-foreground">{formatDate(selectedCategory.createdAt)}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(new Date(value));
}
