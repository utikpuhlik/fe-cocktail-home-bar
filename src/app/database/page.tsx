export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { CocktailGrid } from "@/components/cocktail-grid";
import { CocktailSearch } from "@/components/cocktail-search";
import { Skeleton } from "@/components/ui/skeleton";
import { getCocktails, searchCocktails } from "@/lib/api";
import type { Cocktail } from "@/lib/schemas/cocktail";

export default async function DatabasePage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;

	const data = q ? await searchCocktails(q) : await getCocktails({ size: 100 });

	const cocktails = data.items as Cocktail[];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Database</h1>
				<p className="text-muted-foreground">Browse all cocktails</p>
			</div>
			<Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
				<CocktailSearch />
			</Suspense>
			<CocktailGrid cocktails={cocktails} />
		</div>
	);
}
