import { mock } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "bun:test";

mock.module("next-themes", () => ({
	useTheme: () => ({
		setTheme: () => {},
		theme: "light",
	}),
}));

import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
	test("uses a positioned button wrapper for stacked theme icons", () => {
		const markup = renderToStaticMarkup(<ThemeToggle />);

		expect(markup).toContain("relative");
		expect(markup).toContain("absolute");
	});
});
