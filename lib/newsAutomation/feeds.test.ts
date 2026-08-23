import { describe, expect, it } from "vitest";
import { getDomainName } from "./feeds";

describe("getDomainName", () => {
  it("maps a known host to its display name", () => {
    expect(getDomainName("https://www.thedailystar.net/news/some-story", "fallback")).toBe(
      "The Daily Star"
    );
  });

  it("strips the www prefix before matching known hosts", () => {
    expect(getDomainName("https://bdnews24.com/rss/bangladesh", "fallback")).toBe("BD News 24");
  });

  it("falls back to a capitalized label for an unknown host", () => {
    expect(getDomainName("https://www.somenewsite.com/article", "fallback")).toBe("Somenewsite");
  });

  it("returns the fallback for an empty url", () => {
    expect(getDomainName("", "fallback")).toBe("fallback");
  });

  it("returns the fallback for an unparseable url", () => {
    expect(getDomainName("not a url", "fallback")).toBe("fallback");
  });
});
