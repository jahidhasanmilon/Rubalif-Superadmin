import { NextRequest, NextResponse } from "next/server";
import { runAutomationPipeline } from "@/lib/newsAutomation/run";
import { logAutomationRun } from "@/lib/newsAutomation/firebaseRest";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const result = await runAutomationPipeline(claudeApiKey, dbUrl);
  await logAutomationRun(dbUrl, result, "cron");
  return NextResponse.json(result);
}
