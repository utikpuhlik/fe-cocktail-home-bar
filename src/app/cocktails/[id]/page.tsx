import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCocktailById } from "@/lib/api";
import type { Cocktail } from "@/lib/schemas/cocktail";

export default async function CocktailDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let cocktail: Cocktail;
	try {
		const data = await getCocktailById(id);
		const item = data.items[0];
		if (!item) notFound();
		cocktail = item as Cocktail;
	} catch {
		notFound();
	}

	const thumbnail = cocktail.images.find((img) => img.is_thumbnail);
	const imageUrl =
		thumbnail?.image_url ?? "https://chibisafe.eucalytics.uk/N2KCFkixOWWs.png";

	return (
		<div className="space-y-8">
			<div className="grid gap-8 md:grid-cols-2">
				<Card className="overflow-hidden">
					<Image
						src={imageUrl}
						alt={cocktail.name}
						width={600}
						height={600}
						className="h-full w-full object-cover"
						priority
						unoptimized
					/>
					{cocktail.images.length > 1 && (
						<CardContent className="flex flex-wrap gap-2 p-4">
							{cocktail.images.map((img) => (
								<Image
									key={img.image_url}
									src={img.image_url}
									alt={cocktail.name}
									width={64}
									height={64}
									className="h-16 w-16 rounded-md border object-cover"
									unoptimized
								/>
							))}
						</CardContent>
					)}
				</Card>

				<div className="space-y-4">
					<h1 className="font-bold text-3xl tracking-tight">{cocktail.name}</h1>
					<p className="text-muted-foreground">{cocktail.description}</p>

					<Separator />

					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="font-medium">ABV:</span>
							<span>{cocktail.alcohol_content}%</span>
						</div>
						{cocktail.rating !== null && (
							<div className="flex items-center gap-2">
								<span className="font-medium">Rating:</span>
								<span>{cocktail.rating.toFixed(1)} / 10</span>
							</div>
						)}
					</div>

					<div className="flex flex-wrap gap-1">
						{cocktail.labels.map((label) => (
							<Badge key={label.id} variant="secondary">
								{label.name}
							</Badge>
						))}
					</div>

					{cocktail.recipe && (
						<>
							<Separator />
							<div>
								<h2 className="mb-2 font-semibold text-xl">Recipe</h2>
								<div className="whitespace-pre-line text-muted-foreground">
									{cocktail.recipe}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
