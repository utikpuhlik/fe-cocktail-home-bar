import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "bun:test";

import {
	CocktailDetailSkeleton,
	CocktailGridSkeleton,
} from "./cocktail-skeletons";

describe("cocktail loading skeletons", () => {
	test("renders multiple card skeleton placeholders", () => {
		const markup = renderToStaticMarkup(<CocktailGridSkeleton />);
		const skeletonCount = markup.match(/data-slot="skeleton"/g)?.length ?? 0;

		expect(skeletonCount).toBeGreaterThanOrEqual(12);
	});

	test("renders detail skeleton placeholders", () => {
		const markup = renderToStaticMarkup(<CocktailDetailSkeleton />);
		const skeletonCount = markup.match(/data-slot="skeleton"/g)?.length ?? 0;

		expect(skeletonCount).toBeGreaterThanOrEqual(8);
	});
});
