import { describe, expect, test } from "bun:test";
import { cocktailSchema } from "./cocktail";

describe("cocktail schema", () => {
	test("accepts images with string urls", () => {
		const result = cocktailSchema.safeParse({
			id: 1,
			name: "Negroni",
			description: "Bitter and spirit-forward.",
			recipe: null,
			alcohol_content: 24,
			drink_type: null,
			rating: null,
			in_stock: true,
			labels: [],
			images: [
				{
					image_url: "https://example.com/negroni.jpg",
					is_thumbnail: true,
				},
			],
		});

		expect(result.success).toBe(true);
	});

	test("rejects images with null urls", () => {
		const result = cocktailSchema.safeParse({
			id: 1,
			name: "Negroni",
			description: "Bitter and spirit-forward.",
			recipe: null,
			alcohol_content: 24,
			drink_type: null,
			rating: null,
			in_stock: true,
			labels: [],
			images: [
				{
					image_url: null,
					is_thumbnail: true,
				},
			],
		});

		expect(result.success).toBe(false);
	});
});
