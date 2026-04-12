import { z } from "zod";

export const orderSchema = z.object({
	status: z.string(),
	cocktail_ids: z.array(z.number()),
	user_name: z.string().min(1, "Name is required"),
});

export type OrderInput = z.infer<typeof orderSchema>;
