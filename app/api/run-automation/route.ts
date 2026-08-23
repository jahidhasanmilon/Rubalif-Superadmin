import { NextRequest, NextResponse } from "next/server";
import { runAutomationPipeline } from "@/lib/newsAutomation/run";

export const runtime = "nodejs";
export const maxDuration = 60;

async function isValidIdToken(idToken: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return Array.isArray(data?.users) && data.users.length > 0;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken || !(await isValidIdToken(idToken))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const claudeApiKey = process.env.CLAUDE_API_KEY;
  const dbUrl = process.env.FIREBASE_DB_URL;
  if (!claudeApiKey || !dbUrl) {
    return NextResponse.json({ error: "Missing CLAUDE_API_KEY or FIREBASE_DB_URL" }, { status: 500 });
  }

  const result = await runAutomationPipeline(claudeApiKey, dbUrl);
  return NextResponse.json(result);
}
