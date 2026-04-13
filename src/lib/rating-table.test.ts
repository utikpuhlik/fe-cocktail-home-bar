import { describe, expect, test } from "bun:test";
import { type Cocktail, cocktailSchema } from "@/lib/schemas/cocktail";
import {
	RATING_TABLE_DEFAULT_SORT,
	buildTasteFilterOptions,
	sortCocktailsByRating,
} from "./rating-table";

const cocktails: Cocktail[] = [
	cocktailSchema.parse({
		id: "11111111-1111-4111-8111-111111111111",
		name: "Margarita",
		description: "Bright and citrusy.",
		recipe: null,
		alcohol_content: 14,
		drink_type: "SHORT_DRINK",
		taste_profile: "sour",
		rating: 4.5,
		in_stock: true,
		labels: [],
		images: [],
	}),
	cocktailSchema.parse({
		id: "22222222-2222-4222-8222-222222222222",
		name: "Old Fashioned",
		description: "Spirit-forward.",
		recipe: null,
		alcohol_content: 18,
		drink_type: "SHORT_DRINK",
		taste_profile: "semi_sweet",
		rating: 4.8,
		in_stock: true,
		labels: [],
		images: [],
	}),
	cocktailSchema.parse({
		id: "33333333-3333-4333-8333-333333333333",
		name: "No Rating Sour",
		description: "Unrated.",
		recipe: null,
		alcohol_content: 11,
		drink_type: "LONG_DRINK",
		taste_profile: "sour",
		rating: null,
		in_stock: true,
		labels: [],
		images: [],
	}),
];

describe("rating table helpers", () => {
	test("defaults to rating descending", () => {
		expect(RATING_TABLE_DEFAULT_SORT).toEqual([{ id: "rating", desc: true }]);
	});

	test("sorts rated cocktails ahead of unrated cocktails", () => {
		expect(sortCocktailsByRating(cocktails).map((cocktail) => cocktail.name)).toEqual([
			"Old Fashioned",
			"Margarita",
			"No Rating Sour",
		]);
	});

	test("deduplicates and sorts taste filter options", () => {
		expect(buildTasteFilterOptions(cocktails)).toEqual(["semi_sweet", "sour"]);
	});
});
