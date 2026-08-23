import { afterEach, describe, expect, it, vi } from "vitest";
import { processWithClaude } from "./claude";
import type { RawNewsItem } from "./rssFetcher";

const item: RawNewsItem = {
  title: "Sample title",
  url: "https://example.com/story",
  description: "Sample description",
  thumbnail: "",
  sourceName: "Example",
};

function mockFetchOnce(response: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: async () => response,
    })
  );
}

describe("processWithClaude", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses and truncates a well-formed Claude response", async () => {
    const payload = {
      headLineEnglish: "A".repeat(150),
      headLineNepali: "শিরোনাম",
      titleEnglish: "B".repeat(60),
      titleNepali: "শিরোনাম",
      descriptionEnglish: "C".repeat(400),
      descriptionNepali: "বিবরণ",
      topicA: "bangladesh",
      topicB: "",
      topicC: "",
    };
    mockFetchOnce({ content: [{ text: JSON.stringify(payload) }] });

    const result = await processWithClaude(item, "en", "fake-key");

    expect(result).not.toBeNull();
    expect(result!.headLineEnglish).toHaveLength(100);
    expect(result!.titleEnglish).toHaveLength(45);
    expect(result!.descriptionEnglish).toHaveLength(360);
    expect(result!.topicA).toBe("bangladesh");
  });

  it("strips markdown code fences before parsing", async () => {
    const payload = { headLineEnglish: "Headline" };
    mockFetchOnce({ content: [{ text: "```json\n" + JSON.stringify(payload) + "\n```" }] });

    const result = await processWithClaude(item, "en", "fake-key");

    expect(result?.headLineEnglish).toBe("Headline");
  });

  it("returns null when the API call fails", async () => {
    mockFetchOnce({}, false);

    const result = await processWithClaude(item, "en", "fake-key");

    expect(result).toBeNull();
  });

  it("returns null when the response body isn't valid JSON", async () => {
    mockFetchOnce({ content: [{ text: "not json" }] });

    const result = await processWithClaude(item, "en", "fake-key");

    expect(result).toBeNull();
  });
});
