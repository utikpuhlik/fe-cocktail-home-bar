import { z } from "zod";

export const labelSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const imageSchema = z.object({
	image_url: z.string(),
	is_thumbnail: z.boolean(),
});

export const cocktailSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	recipe: z.string().nullable(),
	alcohol_content: z.number(),
	drink_type: z.string().nullable(),
	rating: z.number().nullable(),
	in_stock: z.boolean(),
	labels: z.array(labelSchema),
	images: z.array(imageSchema),
});

export const cocktailListResponseSchema = z.object({
	items: z.array(cocktailSchema),
});

export type Label = z.infer<typeof labelSchema>;
export type CocktailImage = z.infer<typeof imageSchema>;
export type Cocktail = z.infer<typeof cocktailSchema>;
export type CocktailListResponse = z.infer<typeof cocktailListResponseSchema>;
