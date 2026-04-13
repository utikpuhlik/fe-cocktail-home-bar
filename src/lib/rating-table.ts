import type { SortingState } from "@tanstack/react-table";
import type { Cocktail } from "@/lib/schemas/cocktail";
import type { TasteProfile } from "./taste-profile";

export const RATING_TABLE_DEFAULT_SORT: SortingState = [
	{ id: "rating", desc: true },
];

export function sortCocktailsByRating(cocktails: Cocktail[]): Cocktail[] {
	return [...cocktails].sort((left, right) => {
		const leftRating = left.rating ?? Number.NEGATIVE_INFINITY;
		const rightRating = right.rating ?? Number.NEGATIVE_INFINITY;

		if (leftRating === rightRating) {
			return left.name.localeCompare(right.name);
		}

		return rightRating - leftRating;
	});
}

export function buildTasteFilterOptions(cocktails: Cocktail[]): TasteProfile[] {
	return [...new Set(cocktails.flatMap((cocktail) => cocktail.taste_profile ?? []))].sort(
		(left, right) => left.localeCompare(right),
	);
}
