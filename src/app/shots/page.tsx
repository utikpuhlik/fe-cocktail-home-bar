export const dynamic = "force-dynamic";

import { CocktailGrid } from "@/components/cocktail-grid";
import { getCocktails } from "@/lib/api";
import type { Cocktail } from "@/lib/schemas/cocktail";

export default async function ShotsPage() {
	const data = await getCocktails({ size: 100, drink_type: "SHOT" });
	const cocktails = data.items as Cocktail[];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Shots</h1>
				<p className="text-muted-foreground">Quick and bold</p>
			</div>
			<CocktailGrid cocktails={cocktails} />
		</div>
	);
}
