"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export function CocktailSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [_isPending, startTransition] = useTransition();
	const [value, setValue] = useState(searchParams.get("q") ?? "");

	const handleSearch = useCallback(
		(term: string) => {
			setValue(term);
			startTransition(() => {
				const params = new URLSearchParams(searchParams.toString());
				if (term) {
					params.set("q", term);
				} else {
					params.delete("q");
				}
				router.push(`/database?${params.toString()}`);
			});
		},
		[router, searchParams],
	);

	return (
		<Input
			placeholder="Search cocktails..."
			value={value}
			onChange={(e) => handleSearch(e.target.value)}
			className="max-w-md"
		/>
	);
}
