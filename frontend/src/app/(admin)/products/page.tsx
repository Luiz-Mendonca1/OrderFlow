import { Suspense } from "react";
import { Box } from "lucide-react";
import { api } from "@/app/lib/api";
import { getAuthToken } from "@/app/lib/auth";
import { ProductList } from "./ProductList";

type Category = { id: string; name: string };
type Product = { id: string; name: string; description: string; price: number; banner: string; disabled: boolean; categoryId: string; category?: Category; createdAt: string };

export default function ProductsPage() {
  return <div className="mx-auto w-full max-w-6xl space-y-8"><header><p className="flex items-center gap-2 text-sm font-medium text-primary"><Box size={16} /> Catálogo</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Produtos</h1><p className="mt-2 text-muted">Gerencie os itens do seu cardápio.</p></header><Suspense fallback={<ProductsLoading />}><ProductsContent /></Suspense></div>;
}

async function ProductsContent() {
  const token = await getAuthToken();
  const [productsResponse, categoriesResponse] = await Promise.all([api("/product", { token }), api("/category", { token })]);
  if (!productsResponse.ok || !categoriesResponse.ok) throw new Error("Não foi possível carregar os produtos.");
  return <ProductList products={(await productsResponse.json()) as Product[]} categories={(await categoriesResponse.json()) as Category[]} token={token} />;
}

function ProductsLoading() {
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Carregando produtos">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-xl border border-border bg-card" />)}</section>;
}
