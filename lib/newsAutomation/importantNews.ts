const SKIP_KEYWORDS = [
  "recipe",
  "রেসিপি",
  "cooking",
  "রান্না",
  "horoscope",
  "রাশিফল",
  "zodiac",
  "advertisement",
  "বিজ্ঞাপন",
  "sponsored",
  "প্রচারিত",
  "weather forecast",
  "আবহাওয়া",
  "stock price",
  "শেয়ার দর",
  "lottery",
  "লটারি",
  "astrology",
  "জ্যোতিষ",
];

export function isImportantNews(title: string): boolean {
  const titleLower = title.toLowerCase();
  return !SKIP_KEYWORDS.some((kw) => titleLower.includes(kw.toLowerCase()));
}
