# George Geranios — deploy to Vercel

A Next.js 16 photography site with a built-in admin CMS (Neon Postgres +
Vercel Blob), deployed on Vercel. This README is the **step-by-step guide to
getting it live on Vercel** (plus local dev and troubleshooting).

> The public site renders from built-in seed data, so it goes live on Vercel
> **immediately** — the database steps below are only needed for the admin to
> save edits.

---

## What you need first

1. **A GitHub account** with this repo pushed to it.
2. **A Vercel account** ([vercel.com](https://vercel.com), free tier is fine).
3. **A Neon Postgres database** ([neon.tech](https://neon.tech), free tier).
4. Five **environment variables** (table below) ready to paste in.

---

## Step 1 — Push the repo to GitHub

```bash
cd george.geranios
git init -b main          # if not already a repo
git add -A && git commit -m "Next.js photography site"
git remote add origin git@github.com:<you>/george-geranios.git
git push -u origin main
```

(If it's already on GitHub, skip this.)

---

## Step 2 — Create the Neon database

1. Sign in to [neon.tech](https://neon.tech) → **Create Project**.
2. Once created, open the project → **Dashboard** → copy the **Pooled connection
   string**. It looks like:
   ```
   postgres://<user>:<pass>@ep-xxx-pooler.<region>.aws.neon.tech/neondb?sslmode=require
   ```
   Make sure it ends with `?sslmode=require` and contains **`-pooler`** (the
   pooled URL — required for serverless). **This is your `DATABASE_URL`.**

---

## Step 3 — Generate a session secret

The admin login uses a signed cookie. Generate a random key:

```bash
openssl rand -base64 32
# or, if openssl isn't installed:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**This is your `AUTH_SECRET`.**

---

## Step 4 — Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your `george-geranios` GitHub repo.
3. Vercel auto-detects **Next.js**. Keep:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (the repo root — where `package.json` is)
   - **Build Command / Output:** leave as auto-detected (`next build`)
4. **Don't deploy yet** — expand **Environment Variables** and add the five below.

---

## Step 5 — Add environment variables

In the Vercel import screen (or later under **Settings → Environment Variables**),
add each to **Production, Preview, and Development**:

| Name | Value |
|---|---|
| `DATABASE_URL` | the Neon pooled DSN from Step 2 |
| `AUTH_SECRET` | the secret from Step 3 |
| `ADMIN_EMAIL` | your admin login email (e.g. `studio@georgegeranios.com`) |
| `ADMIN_PASSWORD` | your admin login password — **choose a strong one** |
| `BLOB_READ_WRITE_TOKEN` | leave empty for now (added in Step 7) |

Click **Deploy**. In ~1–2 minutes the site is live at
`https://george-geranios.vercel.app` (or your project name). The public pages
work right away (seed data).

---

## Step 6 — Create the database tables (one-time)

Vercel builds the app but does **not** run database migrations. From your own
machine, using the **production** `DATABASE_URL`, create the schema and (optional)
seed it:

```bash
# set the PROD DATABASE_URL for these commands (or put it in a local .env temporarily)
export DATABASE_URL="postgres://...-pooler...neon.tech/neondb?sslmode=require"

npm install                 # first time on this machine
npm run db:push             # creates the projects / publications / news tables
npm run db:seed             # optional: fills them with the sample content
```

After this, the admin can create/edit/delete and changes persist + go live
(pages revalidate within ~1 minute via ISR).

> Prefer to start with an empty CMS? Skip `npm run db:seed` and add your own
> content through the admin.

---

## Step 7 — Enable image uploads (Vercel Blob)

So the admin can upload cover/gallery photos:

1. In Vercel → your project → **Storage** → **Create** → **Blob**.
2. **Connect** the Blob store to the project. Vercel injects
   `BLOB_READ_WRITE_TOKEN` automatically. (If it doesn't, copy the token from the
   store and add it under **Settings → Environment Variables**.)
3. **Redeploy** (Deployments → the latest → ⋯ → Redeploy) so the token is live.

Uploads now work in the admin (Project/Publication forms → cover + gallery).

---

## Step 8 — Use the site + admin

- **Public site:** `https://<your-project>.vercel.app` — home, `/projects`,
  `/publications`, `/news`, `/available`, `/about`, `/contact`.
- **Admin:** `https://<your-project>.vercel.app/admin/login` → sign in with your
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Create a Project with a cover + gallery → it
  appears on `/projects` shortly after.

**Done.** Every `git push` to `main` now rebuilds + redeploys automatically.

---

## Environment variables (reference)

| Variable | Required for | How to get it |
|---|---|---|
| `DATABASE_URL` | admin (read/write), persistence | Neon → pooled connection string (`…?sslmode=require`) |
| `AUTH_SECRET` | admin login | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | admin login | you choose |
| `ADMIN_PASSWORD` | admin login | you choose (strong) |
| `BLOB_READ_WRITE_TOKEN` | admin image uploads | Vercel → Storage → Blob → connect |

Never commit these. They live only in `.env` (local) and the Vercel dashboard.

---

## Alternative: deploy with the Vercel CLI

If you prefer the CLI over the GitHub import:

```bash
npm i -g vercel
vercel login
vercel link            # link this directory to a Vercel project
vercel env add DATABASE_URL        # paste value (repeat for each var)
vercel env add AUTH_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel --prod          # deploy to production
```

---

## Local development

```bash
cp .env.example .env     # fill in the same vars (use a separate Neon DB for dev)
npm install
npm run db:push          # create the schema
npm run db:seed          # optional: sample content
npm run dev              # → http://localhost:3000
```

Admin at `http://localhost:3000/admin/login`. Without a `DATABASE_URL` the public
site still renders (seed fallback); the admin needs the DB to save edits.

`just` recipes (Nix devShell): `just dev`, `just db-push`, `just db-seed`,
`just db-studio`, `just build`.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Site deployed but looks like placeholder content | Expected — that's the seed fallback. Run Step 6 (`db:push`/`db:seed`) to use the DB, or edit via the admin. |
| Admin says "Database not configured" | `DATABASE_URL` missing or empty on Vercel → add it (all environments) + redeploy. |
| `db:push` errors on connection | Use the **pooled** Neon URL with `?sslmode=require`; ensure your IP is allowed (Neon defaults allow all). |
| Admin login fails | `AUTH_SECRET` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` not set, or set only in one environment. Re-check in Vercel → Settings → Environment Variables. |
| Image upload fails / "BLOB_READ_WRITE_TOKEN not set" | Blob not connected — do Step 7 + redeploy. |
| `next/image` shows a remote-host error | Allowed hosts are set in `next.config.ts` (`images.unsplash.com` + `*.vercel-storage.com`). Add your host there if you use another. |
| `/admin` redirects to `/admin/login` forever | Clear cookies; confirm `AUTH_SECRET` is the same value used to sign in. |

---

## Stack & structure (brief)

Next.js 16 (App Router, React 19, TS, Tailwind v4) + shadcn/ui; Drizzle ORM over
Neon; Vercel Blob; single-admin jose cookie session; next/image with a watermarked
lightbox; dark mode via next-themes.

```
app/            public pages (server components, ISR) + admin/ (CRUD) + api/upload
db/             schema.ts (Drizzle), seed.ts, seed-data.ts (the sample content)
lib/            db.ts · data.ts (Neon with seed fallback) · session.ts · admin.ts
components/     sidebar, catalogue, gallery (lightbox), admin forms, ui/ (shadcn), theme
middleware.ts   guards /admin/*
next.config.ts  image remote patterns
```
