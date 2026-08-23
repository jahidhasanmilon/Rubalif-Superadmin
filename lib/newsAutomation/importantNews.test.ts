import { describe, expect, it } from "vitest";
import { isImportantNews } from "./importantNews";

describe("isImportantNews", () => {
  it("accepts a normal news headline", () => {
    expect(isImportantNews("Government announces new budget for education")).toBe(true);
  });

  it.each([
    "Best recipe for chicken curry",
    "আজকের রাশিফল: মেষ রাশি",
    "Weather forecast for Dhaka this weekend",
    "Lottery winner announced",
  ])("rejects skip-keyword headline: %s", (title) => {
    expect(isImportantNews(title)).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isImportantNews("TODAY'S HOROSCOPE for all signs")).toBe(false);
  });
});
