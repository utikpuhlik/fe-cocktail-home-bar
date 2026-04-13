import { describe, expect, test } from "bun:test";
import {
	getTasteProfileBadgeClassName,
	getTasteProfileLabel,
	isTasteLabelName,
} from "./taste-profile";

describe("taste profile helpers", () => {
	test("formats semi sweet labels for badges", () => {
		expect(getTasteProfileLabel("semi_sweet")).toBe("Semi sweet");
	});

	test("returns a styled badge class for bitter cocktails", () => {
		expect(getTasteProfileBadgeClassName("bitter")).toContain("bg-orange-500/85");
	});

	test("recognizes legacy taste labels in ingredient tags", () => {
		expect(isTasteLabelName("Citrus")).toBe(true);
		expect(isTasteLabelName("Gin")).toBe(false);
	});
});
