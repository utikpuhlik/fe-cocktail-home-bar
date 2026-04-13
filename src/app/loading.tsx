import { CocktailGridSkeleton } from "@/components/cocktail-skeletons";

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<div className="h-9 w-56 animate-pulse rounded-2xl bg-muted" />
				<div className="h-5 w-44 animate-pulse rounded-2xl bg-muted" />
			</div>
			<CocktailGridSkeleton />
		</div>
	);
}
