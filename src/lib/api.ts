const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const url = `${API_URL}${path}`;
	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

export async function getCocktails(params?: {
	size?: number;
	in_stock?: boolean;
	drink_type?: string;
}) {
	const searchParams = new URLSearchParams();
	if (params?.size) searchParams.set("size", String(params.size));
	if (params?.in_stock !== undefined)
		searchParams.set("in_stock", String(params.in_stock));
	if (params?.drink_type) searchParams.set("drink_type", params.drink_type);

	const query = searchParams.toString();
	return apiFetch<{ items: unknown[] }>(
		`/cocktails${query ? `?${query}` : ""}`,
	);
}

export async function searchCocktails(searchTerm: string) {
	return apiFetch<{ items: unknown[] }>(
		`/cocktails/search?search_term=${encodeURIComponent(searchTerm)}`,
	);
}

export async function getCocktailById(id: string) {
	return apiFetch<{ items: unknown[] }>(`/cocktails?cocktail_id=${id}`);
}

export async function getLabels() {
	return apiFetch<Array<{ id: string; name: string }>>("/labels");
}

export async function createOrder(data: {
	status: string;
	cocktail_ids: string[];
	user_name: string;
}) {
	return apiFetch("/order", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
