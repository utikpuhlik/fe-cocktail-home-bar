import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { cocktailSchema } from "@/lib/schemas/cocktail";
import { RatingTableView } from "./rating-table-view";

const cocktails = [
	cocktailSchema.parse({
		id: "11111111-1111-4111-8111-111111111111",
		name: "Old Fashioned",
		description: "Classic whiskey cocktail.",
		recipe: "Stir with ice.",
		alcohol_content: 18,
		drink_type: "SHORT_DRINK",
		taste_profile: "semi_sweet",
		rating: 4.8,
		in_stock: true,
		labels: [{ id: "22222222-2222-4222-8222-222222222222", name: "Bourbon" }],
		images: [],
	}),
];

describe("rating table view", () => {
	test("renders rating data and a details sheet trigger", () => {
		const markup = renderToStaticMarkup(<RatingTableView cocktails={cocktails} />);

		expect(markup).toContain("Old Fashioned");
		expect(markup).toContain("4.8");
		expect(markup).toContain("Details");
		expect(markup).toContain('data-slot="sheet-trigger"');
	});
});
