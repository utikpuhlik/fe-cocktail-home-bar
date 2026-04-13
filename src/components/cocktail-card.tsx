import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Cocktail } from "@/lib/schemas/cocktail";
import {
	getTasteProfileBadgeClassName,
	getTasteProfileLabel,
	isTasteLabelName,
} from "@/lib/taste-profile";

const IMAGE_PLACEHOLDER = "https://cdn.eucalytics.uk/default.svg";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
	const thumbnail = cocktail.images.find((img) => img.is_thumbnail);
	const imageUrl = thumbnail?.image_url ?? IMAGE_PLACEHOLDER;
	const ingredientLabels = cocktail.labels.filter(
		(label) => !isTasteLabelName(label.name),
	);

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="p-0">
				<div className="relative aspect-[5/4] overflow-hidden rounded-t-lg">
					<Image
						src={imageUrl}
						alt={cocktail.name}
						fill
						className="object-cover"
						sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
						unoptimized
					/>
					{cocktail.taste_profile && (
						<div className="absolute top-3 right-3">
							<Badge
								className={getTasteProfileBadgeClassName(
									cocktail.taste_profile,
								)}
							>
								{getTasteProfileLabel(cocktail.taste_profile)}
							</Badge>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-2 p-4">
				<CardTitle className="text-lg">{cocktail.name}</CardTitle>
				<p className="line-clamp-2 text-muted-foreground text-sm">
					{cocktail.description}
				</p>
				<div className="text-sm">
					<span className="font-medium">ABV:</span> {cocktail.alcohol_content}%
				</div>
				{cocktail.rating !== null && (
					<div className="text-sm">
						<span className="font-medium">Rating:</span>{" "}
						{cocktail.rating.toFixed(1)}
					</div>
				)}
				<div className="mt-auto flex flex-wrap gap-1 pt-2">
					{ingredientLabels.map((label) => (
						<Badge key={label.id} variant="secondary">
							{label.name}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Link href={`/cocktails/${cocktail.id}`} className="w-full">
					<Button className="w-full">View Details</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
