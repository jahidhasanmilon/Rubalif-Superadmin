import { NextRequest, NextResponse } from "next/server";
import { runAutomationPipeline } from "@/lib/newsAutomation/run";
import { logAutomationRun } from "@/lib/newsAutomation/firebaseRest";

export const runtime = "nodejs";
export const maxDuration = 60;

async function verifyIdToken(idToken: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const user = Array.isArray(data?.users) ? data.users[0] : null;
  if (!user) return null;
  return user.email || user.localId || "unknown";
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const triggeredBy = idToken ? await verifyIdToken(idToken) : null;
  if (!triggeredBy) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const claudeApiKey = process.env.CLAUDE_API_KEY;
  const dbUrl = process.env.FIREBASE_DB_URL;
  if (!claudeApiKey || !dbUrl) {
    return NextResponse.json({ error: "Missing CLAUDE_API_KEY or FIREBASE_DB_URL" }, { status: 500 });
  }

  const result = await runAutomationPipeline(claudeApiKey, dbUrl);
  await logAutomationRun(dbUrl, result, "manual", triggeredBy);
  return NextResponse.json(result);
}
