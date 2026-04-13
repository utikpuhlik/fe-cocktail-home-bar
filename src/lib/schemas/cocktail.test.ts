import { describe, expect, test } from "bun:test";
import { cocktailSchema } from "./cocktail";

describe("cocktail schema", () => {
	test("accepts images with string urls", () => {
		const result = cocktailSchema.safeParse({
			id: "11111111-1111-4111-8111-111111111111",
			name: "Negroni",
			description: "Bitter and spirit-forward.",
			recipe: null,
			alcohol_content: 24,
			drink_type: null,
			taste_profile: "bitter",
			rating: null,
			in_stock: true,
			labels: [
				{
					id: "22222222-2222-4222-8222-222222222222",
					name: "Gin",
				},
			],
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
			id: "11111111-1111-4111-8111-111111111111",
			name: "Negroni",
			description: "Bitter and spirit-forward.",
			recipe: null,
			alcohol_content: 24,
			drink_type: null,
			taste_profile: "bitter",
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

	test("rejects unknown taste profiles", () => {
		const result = cocktailSchema.safeParse({
			id: "11111111-1111-4111-8111-111111111111",
			name: "Negroni",
			description: "Bitter and spirit-forward.",
			recipe: null,
			alcohol_content: 24,
			drink_type: null,
			taste_profile: "umami",
			rating: null,
			in_stock: true,
			labels: [],
			images: [],
		});

		expect(result.success).toBe(false);
	});
});
