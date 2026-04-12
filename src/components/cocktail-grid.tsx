import { CocktailCard } from "@/components/cocktail-card";
import type { Cocktail } from "@/lib/schemas/cocktail";

export function CocktailGrid({ cocktails }: { cocktails: Cocktail[] }) {
	if (cocktails.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-lg text-muted-foreground">
					No cocktails found matching your criteria.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{cocktails.map((cocktail) => (
				<CocktailCard key={cocktail.id} cocktail={cocktail} />
			))}
		</div>
	);
}
