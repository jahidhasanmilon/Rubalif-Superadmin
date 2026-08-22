import type { RawNewsItem } from "./rssFetcher";

export interface ProcessedNews {
  headLineEnglish: string;
  headLineNepali: string;
  titleEnglish: string;
  titleNepali: string;
  descriptionEnglish: string;
  descriptionNepali: string;
  topicA: string;
  topicB: string;
  topicC: string;
}

function buildPrompt(title: string, description: string, sourceLang: "en" | "bn"): string {
  const langLabel = sourceLang === "bn" ? "Bangladeshi Bangla" : "English";
  const titleLabel = sourceLang === "bn" ? "Title (Bangla)" : "Title (English)";
  const contentLabel = sourceLang === "bn" ? "Content (Bangla)" : "Content (English)";
  const headlineIntro =
    sourceLang === "bn"
      ? "Natural, compelling English translation of the title."
      : "Clean, punchy English headline.";

  return `You are an award-winning Bangladeshi news journalist writing for a premium digital news app. Your writing is clear, engaging, and reads like it was written by a real human — never robotic or AI-sounding.

Process this ${langLabel} news article:

${titleLabel}: ${title}
${contentLabel}: ${description}

STRICT LANGUAGE RULES:
- headLineEnglish, titleEnglish, descriptionEnglish → ENGLISH only
- headLineNepali, titleNepali, descriptionNepali → BENGALI (বাংলা) only — NOT Nepali, NOT Hindi, standard Bangladeshi Bengali

Return ONLY valid JSON (no markdown, no extra text):
{
  "headLineEnglish": "${headlineIntro} Max 15 words, 100 characters.",
  "headLineNepali": "মূল বাংলা শিরোনাম পরিষ্কার করুন। সর্বোচ্চ ১৫ শব্দ, ১০০ অক্ষর।",
  "titleEnglish": "Ultra-short English rewrite. Max 45 characters.",
  "titleNepali": "অতি সংক্ষিপ্ত বাংলা। সর্বোচ্চ ৪৫ অক্ষর।",
  "descriptionEnglish": "Write a compelling, human-sounding English summary. Use active voice, vivid language, and a natural journalistic tone — as if you are personally explaining this story to a reader. Minimum 50 words, maximum 60 words, max 360 characters. No robotic phrases like 'the article discusses' or 'this news reports'.",
  "descriptionNepali": "একজন দক্ষ বাংলাদেশি সাংবাদিকের মতো স্বাভাবিক, প্রাণবন্ত বাংলায় সারসংক্ষেপ লিখুন। সক্রিয় বাক্য ব্যবহার করুন। ন্যূনতম ৫০ শব্দ, সর্বোচ্চ ৬০ শব্দ, ৩৬০ অক্ষর। 'এই সংবাদে বলা হয়েছে' এই ধরনের রোবোটিক বাক্য ব্যবহার করবেন না।",
  "topicA": "one of: bangladesh, international, politics, sports, technology, entertainment, business, health, education",
  "topicB": "second relevant topic or empty string",
  "topicC": "third relevant topic or empty string"
}`;
}

async function callClaude(prompt: string, apiKey: string): Promise<string | null> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    console.error(`Claude API error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data?.content?.[0]?.text ?? null;
}

export async function processWithClaude(
  item: RawNewsItem,
  sourceLang: "en" | "bn",
  apiKey: string
): Promise<ProcessedNews | null> {
  const prompt = buildPrompt(item.title, item.description, sourceLang);
  const response = await callClaude(prompt, apiKey);
  if (!response) return null;

  const cleaned = response
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "");

  let data: Record<string, string>;
  try {
    data = JSON.parse(cleaned);
  } catch {
    return null;
  }

  return {
    headLineEnglish: (data.headLineEnglish || "").slice(0, 100),
    headLineNepali: (data.headLineNepali || "").slice(0, 100),
    titleEnglish: (data.titleEnglish || "").slice(0, 45),
    titleNepali: (data.titleNepali || "").slice(0, 45),
    descriptionEnglish: (data.descriptionEnglish || "").slice(0, 360),
    descriptionNepali: (data.descriptionNepali || "").slice(0, 360),
    topicA: data.topicA || "",
    topicB: data.topicB || "",
    topicC: data.topicC || "",
  };
}
