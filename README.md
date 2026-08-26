# LabhSetu

LabhSetu is a Next.js App Router project for discovering Indian government schemes through a guided eligibility flow.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` for AI-backed matching.
4. Optionally set `MONGODB_URI` and `MONGODB_DB` to persist shareable reports.
5. Run `npm run dev`.
6. Run `npm run sync:schemes` to ingest official-source metadata into MongoDB.
7. Set `AUTH_SECRET` for email/password login and `RESEND_API_KEY` for daily alert emails.

## OpenRouter

The AI route reads these env vars:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_BASE_URL` (optional)

If the API key or model is missing, LabhSetu falls back to a local demo matching engine so the hackathon flow still works.

## How scheme matching works

- `/api/find-schemes` uses OpenRouter to call your configured model and asks it to match schemes against the user's profile.
- The model is grounded with the Mongo-backed catalog. If Mongo is empty, it falls back to the local catalog in [`lib/schemes-data.ts`](/Users/sagartripathi/Documents/New%20project/lib/schemes-data.ts).
- `/api/schemes` serves Mongo-backed scheme records first.
- MongoDB is only used to save and retrieve shareable report results.

## Live ingestion

- `npm run sync:schemes` fetches official pages from `myscheme.gov.in` plus configured government scheme portals and stores normalized records in MongoDB.
- `POST /api/admin/sync-schemes` runs the same sync logic and can be scheduled with cron. If `SYNC_API_TOKEN` is set, send it as `Authorization: Bearer <token>`.
- For a local MongoDB Community install, the default URI below is the right starting point.
- The official central/state portal registry lives in [`lib/portal-registry.ts`](/Users/sagartripathi/Documents/New%20project/lib/portal-registry.ts) and currently includes national portals plus Maharashtra, Karnataka, Gujarat, Telangana, Andhra Pradesh, Tamil Nadu, Kerala, and Rajasthan sources.

## Accounts and alerts

- `/signup` and `/login` provide email/password auth backed by MongoDB.
- `/dashboard` lets users save their phone number and eligibility profile.
- `POST /api/admin/daily-match` runs the daily eligibility email job and uses Resend when `RESEND_API_KEY` is configured.
- During normal site usage, the app also checks whether the daily eligibility digest is stale and can refresh it in the background.
- `npm run daily-match` calls the protected admin route and is the script to use in cron.
- A ready-to-copy cron example lives at [`cron/daily-match.cron`](/Users/sagartripathi/Documents/New%20project/cron/daily-match.cron).
- `/admin/login` and `/admin` provide a separate admin session that expires in 1 day.
- Admin API routes accept either an authenticated admin session or `Authorization: Bearer ${SYNC_API_TOKEN}`.
