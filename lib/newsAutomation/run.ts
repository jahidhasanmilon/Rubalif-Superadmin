import { RSS_FEEDS, MAX_NEWS_PER_FEED, MAX_NEWS_GOOGLE } from "./feeds";
import { fetchRSS } from "./rssFetcher";
import { isImportantNews } from "./importantNews";
import { processWithClaude } from "./claude";
import {
  addToFirebase,
  newsExists,
  getExistingTitles,
  publishDueScheduled,
} from "./firebaseRest";
import { isDuplicateTitle } from "./similarity";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AutomationResult {
  added: number;
  alreadyExists: number;
  errors: number;
  log: string[];
  finishedAt: string;
}

export async function runAutomationPipeline(
  claudeApiKey: string,
  dbUrl: string
): Promise<AutomationResult> {
  const log: string[] = [];
  let totalAdded = 0;
  let alreadyExists = 0;
  let errors = 0;

  const publishedCount = await publishDueScheduled(dbUrl);
  if (publishedCount > 0) {
    log.push(`Published ${publishedCount} scheduled item(s) that came due`);
  }

  const existingTitles = await getExistingTitles(dbUrl);

  for (const feed of RSS_FEEDS) {
    log.push(`Processing: ${feed.site} (${feed.lang})`);
    const newsItems = await fetchRSS(feed.url);
    if (newsItems.length === 0) {
      log.push("  No items found");
      continue;
    }

    const limit = feed.url.includes("news.google.com") ? MAX_NEWS_GOOGLE : MAX_NEWS_PER_FEED;
    let count = 0;

    for (const item of newsItems) {
      if (count >= limit) break;

      if (await newsExists(dbUrl, item.url)) {
        alreadyExists++;
        continue;
      }

      if (!isImportantNews(item.title)) {
        log.push("  Skipped (not important)");
        continue;
      }

      if (isDuplicateTitle(item.title, existingTitles)) {
        alreadyExists++;
        log.push(`  Skipped (similar title already exists): ${item.title.slice(0, 50)}`);
        continue;
      }

      const processed = await processWithClaude(item, feed.lang, claudeApiKey);
      if (!processed) {
        errors++;
        log.push("  AI processing failed");
        continue;
      }

      const added = await addToFirebase(dbUrl, processed, item, feed.site);
      if (added) {
        totalAdded++;
        count++;
        existingTitles.push(item.title);
        log.push(`  Added: ${processed.headLineEnglish.slice(0, 50)}`);
      } else {
        errors++;
        log.push("  Firebase add failed");
      }

      await sleep(2000);
    }
  }

  return {
    added: totalAdded,
    alreadyExists,
    errors,
    log,
    finishedAt: new Date().toISOString(),
  };
}
