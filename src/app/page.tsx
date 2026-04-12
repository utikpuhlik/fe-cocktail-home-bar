export const dynamic = "force-dynamic";

import { CocktailGrid } from "@/components/cocktail-grid";
import { getCocktails } from "@/lib/api";
import type { Cocktail } from "@/lib/schemas/cocktail";

export default async function SeasonalPage() {
	const data = await getCocktails({ size: 100, in_stock: true });
	const cocktails = data.items as Cocktail[];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Seasonal Menu</h1>
				<p className="text-muted-foreground">Currently available cocktails</p>
			</div>
			<CocktailGrid cocktails={cocktails} />
		</div>
	);
}
