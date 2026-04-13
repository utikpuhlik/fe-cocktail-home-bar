export const dynamic = "force-dynamic";

import { RatingTableView } from "@/components/rating-table-view";
import { getCocktails } from "@/lib/api";
import { cocktailSchema, type Cocktail } from "@/lib/schemas/cocktail";
import { sortCocktailsByRating } from "@/lib/rating-table";

export default async function RatingPage() {
	const data = await getCocktails({ size: 100 });
	const cocktails = sortCocktailsByRating(
		data.items.map((item) => cocktailSchema.parse(item)) as Cocktail[],
	);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Rating</h1>
				<p className="text-muted-foreground">
					Public leaderboard of cocktails by community rating.
				</p>
			</div>
			<RatingTableView cocktails={cocktails} />
		</div>
	);
}
