import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Navbar } from "./navbar";

describe("navbar", () => {
	test("renders a rating link", () => {
		const markup = renderToStaticMarkup(<Navbar />);

		expect(markup).toContain('href="/rating"');
		expect(markup).toContain(">Rating<");
	});
});
