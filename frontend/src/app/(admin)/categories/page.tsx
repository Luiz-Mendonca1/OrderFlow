import { Suspense } from "react";
import { FolderOpen } from "lucide-react";
import { api } from "@/app/lib/api";
import { getAuthToken } from "@/app/lib/auth";
import { CategoryList } from "./CategoryList";

type Category = {
	id: string;
	name: string;
	createdAt: string;
};

export default function CategoriesPage() {
	return (
		<div className="mx-auto w-full max-w-6xl space-y-8">
			<header className="flex items-end justify-between gap-4">
				<div>
					<p className="flex items-center gap-2 text-sm font-medium text-primary">
						<FolderOpen size={16} /> Catálogo
					</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Categorias</h1>
					<p className="mt-2 text-muted">Organize os produtos do seu cardápio.</p>
				</div>
			</header>

			<Suspense fallback={<CategoriesLoading />}>
				<CategoriesContent />
			</Suspense>
		</div>
	);
}

async function CategoriesContent() {
	const token = await getAuthToken();
	const response = await api("/category", { token });

	if (!response.ok) {
		throw new Error("Não foi possível carregar as categorias.");
	}

	const categories = (await response.json()) as Category[];
	return <CategoryList categories={categories} token={token} />;
}

function CategoriesLoading() {
	return (
		<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Carregando categorias">
			{[1, 2, 3].map((item) => (
				<div key={item} className="h-40 animate-pulse rounded-xl border border-border bg-card" />
			))}
		</section>
	);
}