import { CocktailGridSkeleton } from "@/components/cocktail-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-9 w-28" />
				<Skeleton className="h-5 w-28" />
			</div>
			<CocktailGridSkeleton />
		</div>
	);
}
