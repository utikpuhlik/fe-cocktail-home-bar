import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// TODO: Wire up with env.ts once DATABASE_URL is configured
// import { env } from "@/env";

const connectionString = process.env.DATABASE_URL ?? "";

const sql = postgres(connectionString, {
	max: 10,
	idle_timeout: 30,
	max_lifetime: 60 * 30,
});

export const db = drizzle(sql);
