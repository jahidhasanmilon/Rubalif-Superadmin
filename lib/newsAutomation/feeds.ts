export interface FeedConfig {
  url: string;
  lang: "en" | "bn";
  site: string;
}

export const RSS_FEEDS: FeedConfig[] = [
  // English
  { url: "https://www.thedailystar.net/rss.xml", lang: "en", site: "The Daily Star" },
  { url: "https://www.dhakatribune.com/feed", lang: "en", site: "Dhaka Tribune" },
  { url: "https://www.tbsnews.net/rss.xml", lang: "en", site: "The Business Standard" },
  { url: "https://thefinancialexpress.com.bd/rss.xml", lang: "en", site: "The Financial Express" },
  { url: "https://en.prothomalo.com/feed", lang: "en", site: "Prothom Alo English" },
  { url: "https://www.newagebd.net/rss.xml", lang: "en", site: "New Age BD" },
  { url: "https://bdnews24.com/rss/bangladesh", lang: "en", site: "BD News 24" },
  // Bangla
  { url: "https://www.prothomalo.com/feed", lang: "bn", site: "Prothom Alo" },
  { url: "https://www.kalerkantho.com/rss.xml", lang: "bn", site: "Kaler Kantho" },
  { url: "https://samakal.com/rss.xml", lang: "bn", site: "Samakal" },
  { url: "https://www.jugantor.com/rss.xml", lang: "bn", site: "Jugantor" },
  { url: "https://www.jagonews24.com/rss.xml", lang: "bn", site: "Jago News 24" },
  { url: "https://www.banglatribune.com/feed", lang: "bn", site: "Bangla Tribune" },
  { url: "https://www.ittefaq.com.bd/rss.xml", lang: "bn", site: "Ittefaq" },
  { url: "https://www.manabzamin.com/rss.xml", lang: "bn", site: "Manabzamin" },
  // Google News Bangladesh
  {
    url: "https://news.google.com/rss/search?q=bangladesh&hl=en-BD&gl=BD&ceid=BD:en",
    lang: "en",
    site: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=বাংলাদেশ&hl=bn-BD&gl=BD&ceid=BD:bn",
    lang: "bn",
    site: "Google News বাংলা",
  },
];

export const MAX_NEWS_PER_FEED = 1;
export const MAX_NEWS_GOOGLE = 1;

const KNOWN_SITE_NAMES: Record<string, string> = {
  "thedailystar.net": "The Daily Star",
  "tbsnews.net": "The Business Standard",
  "prothomalo.com": "Prothom Alo",
  "dhakatribune.com": "Dhaka Tribune",
  "bdnews24.com": "BD News 24",
  "newagebd.net": "New Age BD",
  "yahoo.com": "Yahoo News",
  "sports.yahoo.com": "Yahoo Sports",
  "bbc.com": "BBC News",
  "reuters.com": "Reuters",
  "aljazeera.com": "Al Jazeera",
  "timesofindia.com": "Times of India",
  "ndtv.com": "NDTV",
  "espn.com": "ESPN",
  "cricbuzz.com": "Cricbuzz",
  "cricinfo.com": "ESPNcricinfo",
  "jagonews24.com": "Jago News 24",
  "banglatribune.com": "Bangla Tribune",
  "ittefaq.com.bd": "Ittefaq",
  "manabzamin.com": "Manabzamin",
};

export function getDomainName(url: string, fallback: string): string {
  if (!url) return fallback;
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return fallback;
  }
  host = host.replace(/^www\./, "");
  if (KNOWN_SITE_NAMES[host]) return KNOWN_SITE_NAMES[host];
  const label = host.split(".")[0];
  return label.replace(/^./, (c) => c.toUpperCase());
}
