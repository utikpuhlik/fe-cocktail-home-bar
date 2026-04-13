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

const IMAGE_PLACEHOLDER = "https://cdn.eucalytics.uk/default.svg";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
	const thumbnail = cocktail.images.find((img) => img.is_thumbnail);
	const imageUrl = thumbnail?.image_url ?? IMAGE_PLACEHOLDER;

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="p-0">
				<div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
					<Image
						src={imageUrl}
						alt={cocktail.name}
						fill
						className="object-cover"
						unoptimized
					/>
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
					{cocktail.labels.map((label) => (
						<Badge key={label.id} variant="secondary">
							{label.name}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Link href={`/cocktails/${cocktail.id}`} className="w-full">
					<Button variant="outline" className="w-full">
						View Details
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
