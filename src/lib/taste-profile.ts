import type { z } from "zod";
import { tasteProfileSchema } from "@/lib/schemas/cocktail";

export type TasteProfile = z.infer<typeof tasteProfileSchema>;

const TASTE_PROFILE_LABELS: Record<TasteProfile, string> = {
	sweet: "Sweet",
	semi_sweet: "Semi sweet",
	sour: "Sour",
	bitter: "Bitter",
	dry: "Dry",
	fresh: "Fresh",
	creamy: "Creamy",
	fruity: "Fruity",
};

const TASTE_PROFILE_BADGE_CLASSES: Record<TasteProfile, string> = {
	sweet:
		"border-transparent bg-pink-500/85 text-white shadow-sm backdrop-blur-sm",
	semi_sweet:
		"border-transparent bg-amber-500/85 text-amber-950 shadow-sm backdrop-blur-sm",
	sour:
		"border-transparent bg-lime-500/85 text-lime-950 shadow-sm backdrop-blur-sm",
	bitter:
		"border-transparent bg-orange-500/85 text-white shadow-sm backdrop-blur-sm",
	dry: "border-transparent bg-stone-500/85 text-white shadow-sm backdrop-blur-sm",
	fresh:
		"border-transparent bg-teal-500/85 text-white shadow-sm backdrop-blur-sm",
	creamy:
		"border-transparent bg-amber-100/90 text-amber-950 shadow-sm backdrop-blur-sm",
	fruity:
		"border-transparent bg-fuchsia-500/85 text-white shadow-sm backdrop-blur-sm",
};

const LEGACY_TASTE_LABEL_NAMES = new Set([
	"Citrus",
	"Bitter",
	"Tropical",
	"Fruity",
	"Sweet",
	"Sour",
	"Dry",
	"Fresh",
	"Creamy",
]);

export function getTasteProfileLabel(tasteProfile: TasteProfile): string {
	return TASTE_PROFILE_LABELS[tasteProfile];
}

export function getTasteProfileBadgeClassName(tasteProfile: TasteProfile): string {
	return TASTE_PROFILE_BADGE_CLASSES[tasteProfile];
}

export function isTasteLabelName(labelName: string): boolean {
	return LEGACY_TASTE_LABEL_NAMES.has(labelName);
}
