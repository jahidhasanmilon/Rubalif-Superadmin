import { NextRequest, NextResponse } from "next/server";
import { RSS_FEEDS, MAX_NEWS_PER_FEED, MAX_NEWS_GOOGLE } from "@/lib/newsAutomation/feeds";
import { fetchRSS } from "@/lib/newsAutomation/rssFetcher";
import { isImportantNews } from "@/lib/newsAutomation/importantNews";
import { processWithClaude } from "@/lib/newsAutomation/claude";
import { addToFirebase, newsExists } from "@/lib/newsAutomation/firebaseRest";

export const runtime = "nodejs";
export const maxDuration = 60;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const claudeApiKey = process.env.CLAUDE_API_KEY;
  const dbUrl = process.env.FIREBASE_DB_URL;
  if (!claudeApiKey || !dbUrl) {
    return NextResponse.json({ error: "Missing CLAUDE_API_KEY or FIREBASE_DB_URL" }, { status: 500 });
  }

  const log: string[] = [];
  let totalAdded = 0;
  let alreadyExists = 0;
  let errors = 0;

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
        log.push(`  Added: ${processed.headLineEnglish.slice(0, 50)}`);
      } else {
        errors++;
        log.push("  Firebase add failed");
      }

      await sleep(2000);
    }
  }

  return NextResponse.json({
    added: totalAdded,
    alreadyExists,
    errors,
    log,
    finishedAt: new Date().toISOString(),
  });
}
