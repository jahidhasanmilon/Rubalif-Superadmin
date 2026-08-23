# Rubalif Superadmin

Admin dashboard for **Rubalif News** — review, edit, and publish news that's collected and drafted automatically from RSS feeds, with a fully custom Firebase-backed CMS workflow.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20RTDB%20%7C%20Storage-ffca28?logo=firebase)

<!-- Add a screenshot or short GIF of the dashboard here, e.g.: -->
<!-- ![Dashboard screenshot](docs/screenshot.png) -->

## What it does

Rubalif runs a news feed that mixes editor-submitted stories with AI-drafted ones. This app is the control room for that pipeline:

- A **serverless cron job** (`/api/news-automation`) polls a set of Bangladeshi & international RSS feeds daily, filters out irrelevant items, and asks Claude to translate/summarize each story into English + Bengali, then drops it into a `toApprove` queue in Firebase.
- The **admin dashboard** lets an editor review that queue — approve, reject, or hand-edit each story (headline, description, thumbnail, topics) — before it goes live in the `summariser` (published) collection that the Rubalif mobile app reads from.
- Editors can also submit news manually, bypassing the automation entirely.

## Features

- 🔐 Firebase Authentication–gated admin access
- 📊 Live dashboard — pending/published counts, source breakdown (donut chart), volume overview (bar chart), recent activity feed
- ✅ Approve / reject / bulk-approve / bulk-reject pending news
- ✏️ Full edit modal with image upload (Firebase Storage) and live word-count validation
- 🔍 Search + topic filtering on both pending and published lists
- 🌓 Dark/light theme, persisted across sessions
- 📱 Responsive: collapsible desktop sidebar, full-screen mobile drawer, full-bleed mobile layout vs. floating-panel desktop layout
- 🤖 Automated ingestion pipeline: RSS → importance filter → Claude (translate + summarize) → dedupe → queue

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth / DB / Storage | Firebase (Auth, Realtime Database, Storage) |
| AI | Claude (Anthropic API) for summarization/translation |
| Automation trigger | Vercel Cron → API route |
| Hosting | Vercel |

## Project structure

```
app/
  page.tsx                 entry point, wraps <AdminApp/>
  api/news-automation/     cron-triggered ingestion pipeline (Node runtime)
components/                UI (Sidebar, Topbar, Dashboard, news cards, forms, modal…)
hooks/                     useAuth, useNewsData — thin wrappers over the Firebase SDK
lib/
  firebase.ts               client SDK init
  newsActions.ts             approve/reject/edit/upload actions
  newsAutomation/             RSS fetch, Claude prompt, importance filter, Firebase REST writes
```

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Firebase + Claude credentials
npm run dev
```

Required environment variables (see `.env.local.example`):

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `CLAUDE_API_KEY`, `FIREBASE_DB_URL` — used by the server-side automation route
- `CRON_SECRET` — shared secret checked against the cron request's Authorization header

## Deployment

Deployed on Vercel. `vercel.json` schedules the automation route once daily (Vercel's Hobby plan caps cron frequency at once/day — an external scheduler can be used instead for more frequent runs on a paid plan).
