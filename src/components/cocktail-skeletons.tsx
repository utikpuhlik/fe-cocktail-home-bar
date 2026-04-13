import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CocktailGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }, (_, index) => (
				<Card key={`cocktail-skeleton-${index}`} className="flex h-full flex-col">
					<CardHeader className="p-0">
						<div className="relative aspect-[5/4] overflow-hidden rounded-t-lg">
							<Skeleton className="h-full w-full rounded-none" />
						</div>
					</CardHeader>
					<CardContent className="flex flex-1 flex-col gap-2 p-4">
						<Skeleton className="h-7 w-1/2" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-4/5" />
						</div>
						<div className="space-y-2 pt-1">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-24" />
						</div>
						<div className="mt-auto flex flex-wrap gap-1 pt-2">
							<Skeleton className="h-6 w-14 rounded-full" />
							<Skeleton className="h-6 w-20 rounded-full" />
						</div>
					</CardContent>
					<CardFooter className="p-4 pt-0">
						<Skeleton className="h-9 w-full rounded-4xl" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

export function CocktailDetailSkeleton() {
	return (
		<div className="space-y-8">
			<div className="grid gap-8 md:grid-cols-2">
				<Card className="overflow-hidden">
					<div className="relative aspect-square overflow-hidden">
						<Skeleton className="h-full w-full rounded-none" />
					</div>
				</Card>

				<div className="space-y-4">
					<Skeleton className="h-10 w-2/3" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-5/6" />
					</div>
					<Skeleton className="h-px w-full rounded-none" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-32" />
					</div>
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-20 rounded-full" />
						<Skeleton className="h-6 w-14 rounded-full" />
					</div>
					<Skeleton className="h-px w-full rounded-none" />
					<Skeleton className="h-6 w-24" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-11/12" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</div>
		</div>
	);
}
