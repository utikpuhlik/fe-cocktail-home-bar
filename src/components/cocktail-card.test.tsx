import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CocktailCard } from "./cocktail-card";
import { cocktailSchema } from "@/lib/schemas/cocktail";

const cocktail = cocktailSchema.parse({
	id: 1,
	name: "Margarita",
	description: "Bright and citrusy.",
	recipe: null,
	alcohol_content: 14,
	drink_type: "SHORT_DRINK",
	taste_profile: "sour",
	rating: 4.5,
	in_stock: true,
	labels: [],
	images: [
		{
			image_url: "https://example.com/margarita.png",
			is_thumbnail: true,
		},
	],
});

describe("CocktailCard", () => {
	test("renders the thumbnail as an edge-to-edge image in a taller card frame", () => {
		const markup = renderToStaticMarkup(<CocktailCard cocktail={cocktail} />);

		expect(markup).toContain("aspect-[5/4]");
		expect(markup).toContain("object-cover");
		expect(markup).not.toContain("object-contain");
	});
});
