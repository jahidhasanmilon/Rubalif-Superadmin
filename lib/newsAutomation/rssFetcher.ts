import Parser from "rss-parser";

export interface RawNewsItem {
  title: string;
  url: string;
  description: string;
  thumbnail: string;
  sourceName: string;
}

type CustomItem = {
  "media:thumbnail"?: { $?: { url?: string } };
  "media:content"?: { $?: { url?: string } };
  source?: string | { _?: string };
  enclosure?: { url?: string; type?: string };
};

const parser = new Parser<{}, CustomItem>({
  timeout: 15000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; RubalifBot/1.0)" },
  customFields: {
    item: ["media:thumbnail", "media:content", "source"],
  },
});

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function extractImgSrc(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || "";
}

export async function fetchRSS(url: string): Promise<RawNewsItem[]> {
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch {
    return [];
  }
  if (!feed?.items?.length) return [];

  const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
  const items: RawNewsItem[] = [];

  for (const entry of feed.items) {
    const title = decodeEntities((entry.title || "").trim());
    const link = (entry.link || entry.guid || "").trim();
    const rawDescription = entry.content || entry.contentSnippet || entry.summary || "";

    let thumbnail = "";
    const mediaThumb = entry["media:thumbnail"];
    const mediaContent = entry["media:content"];
    if (mediaThumb?.$?.url) {
      thumbnail = mediaThumb.$.url;
    } else if (mediaContent?.$?.url) {
      thumbnail = mediaContent.$.url;
    } else if (entry.enclosure?.type?.includes("image") && entry.enclosure.url) {
      thumbnail = entry.enclosure.url;
    } else if (rawDescription) {
      thumbnail = extractImgSrc(rawDescription);
    }

    let description = decodeEntities(stripTags(rawDescription));
    description = description.replace(/\s+/g, " ").trim();
    if (description.length > 600) description = description.slice(0, 600);

    const pubDate = entry.isoDate || entry.pubDate || "";
    const newsTime = pubDate ? new Date(pubDate).getTime() : Date.now();

    if (title && link && newsTime > sixHoursAgo) {
      let sourceName = "";
      const isGoogleNews = link.includes("news.google.com");
      const source = entry.source;
      if (isGoogleNews || source) {
        sourceName = typeof source === "string" ? source : source?._ || "";
      }

      items.push({ title, url: link, description, thumbnail, sourceName });
    }
  }

  return items;
}
