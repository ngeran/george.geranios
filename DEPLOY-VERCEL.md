# Deploying George Geranios to Vercel — step by step

This guide takes you from "code on your laptop" to "live website on Vercel with a
working admin CMS", one click at a time. No Vercel/Neon experience assumed.

**Time:** ~25–35 minutes the first time.
**Cost:** $0 — everything fits in free tiers.

> 💡 The **public site will be viewable within ~2 minutes** of starting the deploy
> (it renders from built-in sample data). The database steps are what make the
> **admin** able to save real edits. So if you get stuck on Neon, your site is
> already live — come back to the DB steps later.

---

## What you're deploying

A Next.js 16 app (this folder). On Vercel it becomes:

- A **public website** at `https://<your-project>.vercel.app` — home, Projects,
  Publications, News, Available Works, Biography, Contact.
- An **admin CMS** at `/admin/login` — log in to add/edit/delete content and
  upload photos.

---

## Before you start — accounts you need

Create free accounts (if you don't have them):

1. **GitHub** — [github.com](https://github.com) (to host the code + trigger Vercel builds).
2. **Vercel** — [vercel.com](https://vercel.com) (sign up **with your GitHub account** — it makes import one-click).
3. **Neon** — [neon.tech](https://neon.tech) (the database). Sign up with GitHub or email.

---

## Stage 1 — Put the code on GitHub

Vercel builds from a GitHub repo, so the code needs to be there first.

1. Create a new empty repo on GitHub:
   - Go to [github.com/new](https://github.com/new).
   - **Repository name:** `george-geranios` (or anything you like).
   - **Public** or **Private** — both work with Vercel.
   - **Don't** add a README/license (this folder already has files). Click **Create repository**.
2. In a terminal, in this folder:
   ```bash
   git init -b main
   git add -A
   git commit -m "Next.js photography site"
   git remote add origin git@github.com:<your-username>/george-geranios.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `<your-username>`. If you used HTTPS, the remote is
   `https://github.com/<your-username>/george-geranios.git`.)
3. **Verify:** refresh the GitHub repo page — you should see all the project files.

---

## Stage 2 — Create the Neon database

The admin stores content (projects, publications, news) in a Postgres database.

1. Sign in to [neon.tech](https://neon.tech) → **Create new project**.
2. Name it `george-geranios`. Pick the region closest to you (or Vercel's default, `aws-us-east-1`). Click **Create project**.
3. On the project dashboard you'll see a **Connection String** section with two
   tabs: **Pooled connection** and **Direct connection**. **Select "Pooled connection".**
4. Copy the string. It looks like:
   ```
   postgres://<user>:<password>@ep-abc123-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   - It must contain **`-pooler`** (pooled — required for serverless).
   - It must end with **`?sslmode=require`**.
5. **Save it somewhere safe** — this is your **`DATABASE_URL`**. (It has your DB
   password in it; treat it like a secret.)

> Neon free tier: 0.5 GB storage, always-available. Plenty for a portfolio.

---

## Stage 3 — Generate a session secret

The admin login is secured with a random key. Generate one:

```bash
openssl rand -base64 32
```

If `openssl` isn't installed, use Node (this project needs Node anyway):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output (a ~44-character string). This is your **`AUTH_SECRET`**.

---

## Stage 4 — Pick your admin login

Choose the email + password you'll use to sign in to `/admin`. For example:

- **`ADMIN_EMAIL`** = `studio@georgegeranios.com`
- **`ADMIN_PASSWORD`** = (a strong password — this protects who can edit your site)

> These are just values you make up now and paste into Vercel. They're not tied to
> any account.

---

## Stage 5 — Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new). (Sign in with GitHub if prompted.)
2. Under **Import Git Repository**, find `george-geranios`. Click **Import**.
3. Vercel detects the framework. Confirm these settings:
   - **Framework Preset:** `Next.js` ✅ (auto-detected)
   - **Root Directory:** `./` (the repo root — where `package.json` lives) ✅
   - **Build Command:** `next build` (auto) — leave it.
   - **Output Directory:** (auto) — leave it.
4. **Do not click Deploy yet** — first add environment variables (next stage).
   Expand the **"Environment Variables"** section on this same page.

---

## Stage 6 — Add environment variables

On the import page (or later under **Settings → Environment Variables**), add each
of these. For each one: type the **Name**, paste the **Value**, tick **all three
environments** (Production, Preview, Development), click **Add**.

| # | Name | Value | Where it came from |
|---|------|-------|--------------------|
| 1 | `DATABASE_URL` | `postgres://...-pooler...neon.tech/neondb?sslmode=require` | Stage 2 (Neon) |
| 2 | `AUTH_SECRET` | (the 44-char string) | Stage 3 |
| 3 | `ADMIN_EMAIL` | `studio@georgegeranios.com` | Stage 4 |
| 4 | `ADMIN_PASSWORD` | (your strong password) | Stage 4 |
| 5 | `BLOB_READ_WRITE_TOKEN` | *(leave empty for now — added in Stage 9)* | Stage 9 |

> The empty `BLOB_READ_WRITE_TOKEN` is fine to add now as empty, or skip it and
> add it in Stage 9. Either works.

**Now click Deploy.** 🎉

Watch the build logs (you'll see `next build` run). In ~1–2 minutes you'll get a
**"Congratulations"** page with your URL, e.g. `https://george-geranios.vercel.app`.

**Verify:** open the URL. You should see the live photography site (home, Projects,
Publications, etc.). Click around — everything public works from the sample data.

---

## Stage 7 — Create the database tables (so the admin can save)

Vercel builds the app but does **not** run database migrations automatically. You
create the tables once, from your own machine, using the **production** database URL.

1. In a terminal, in this folder:
   ```bash
   npm install                 # first time on this machine
   ```
2. Set the production `DATABASE_URL` for the next commands (paste your Neon string
   from Stage 2):
   ```bash
   export DATABASE_URL="postgres://...-pooler...neon.tech/neondb?sslmode=require"
   ```
   (Or temporarily paste it into a local `.env` file, then remove it after.)
3. Create the schema:
   ```bash
   npm run db:push
   ```
   Drizzle connects to Neon and creates three tables: `projects`, `publications`,
   `news`. Answer any prompt with the default (this is a fresh DB).
4. (Optional) Fill them with the sample content:
   ```bash
   npm run db:seed
   ```
   Skip this if you'd rather start with an empty CMS and add your own work.
5. **Verify:** in Neon → your project → **Tables**, you should now see
   `projects`, `publications`, `news` (with rows if you seeded).

> 💡 **No local Node?** You can also run these via the Vercel CLI from your
> machine: `npm i -g vercel`, `vercel link`, `vercel env pull .env` (pulls the prod
> env into a local `.env`), then `npm run db:push && npm run db:seed`.

---

## Stage 8 — Log in to the admin and add content

1. Open `https://<your-project>.vercel.app/admin/login`.
2. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in Stage 6.
3. You'll see the **Dashboard** with Projects / Publications / News counts.
4. Click **Projects → + New project**. Fill the title, year, etc., and upload a
   cover image + gallery images (Stage 9 enables uploads — without it, paste image
   URLs instead). Click **Save**.
5. **Verify:** open `/projects` on the public site — your new project appears
   within about a minute (ISR revalidates). It also shows in **Available Works** if
   you set `availability = for-sale`, and on the **home** hero if `featured`.

If image **uploads** don't work yet (you see a "BLOB token not set" error), that's
Stage 9 below — finish it, then uploads work.

---

## Stage 9 — Enable image uploads (Vercel Blob)

So the admin can upload photos (instead of pasting URLs):

1. In Vercel → your project → **Storage** tab → **Create Database** → choose **Blob**.
2. Name it (e.g. `george-geranios-blob`), pick a region, **Create**.
3. Click **Connect to Project** (or it auto-connects). This gives the project a
   `BLOB_READ_WRITE_TOKEN`.
4. If the token wasn't added to env vars automatically: open the Blob store → copy
   its read-write token → add it under **Settings → Environment Variables** as
   `BLOB_READ_WRITE_TOKEN` (all environments).
5. **Redeploy** so the token is active: **Deployments** → the latest → ⋯ → **Redeploy**.

**Verify:** back in the admin, edit a project → upload a cover image → it uploads
and shows a preview → **Save** → it appears on the public site.

---

## Stage 10 (optional) — Custom domain

1. Vercel → your project → **Settings → Domains** → **Add** → enter your domain
   (e.g. `georgegeranios.com`).
2. Follow Vercel's instructions to point your domain's DNS (an `A`/`CNAME` record
   at your registrar) to Vercel. Vercel provisions the HTTPS certificate automatically.
3. Once verified, set it as **Primary**. Vercel redirects the `*.vercel.app` URL to it.

---

## ✅ Final verification checklist

- [ ] `https://<project>.vercel.app` loads the site.
- [ ] `/admin/login` → sign in succeeds.
- [ ] Dashboard shows Projects/Publications/News.
- [ ] Created a project/uploaded an image → it appears on `/projects`.
- [ ] (If you set `for-sale`) the project appears on `/available`.
- [ ] (If you set `featured`) it can appear on the home hero.
- [ ] Dark-mode toggle in the sidebar works.
- [ ] Every future `git push` to `main` triggers a Vercel rebuild.

---

## Troubleshooting

**"My site shows placeholder/sample content, not my edits."**
The public site renders sample data until the database is set up + the admin edits
content. Run Stage 7 (`db:push`/`db:seed`), then edit via the admin.

**Admin says "Database not configured."**
`DATABASE_URL` is missing or empty on Vercel. Go to **Settings → Environment
Variables**, confirm `DATABASE_URL` is set in **Production**, then **Redeploy**.
(Environment variables only apply to deployments made *after* you add them.)

**`npm run db:push` fails to connect.**
Use the **Pooled** Neon string (must contain `-pooler`) ending in
`?sslmode=require`. Confirm the string has the password. Neon's free tier allows
connections from any IP by default.

**Admin login always fails ("Invalid email or password").**
Check `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` are all set on Vercel
(Production environment) and you redeployed. Match the email/password exactly
(case-sensitive). `AUTH_SECRET` can be any value, but it must be set (the cookie
won't be valid otherwise).

**Image upload fails / "BLOB_READ_WRITE_TOKEN not set".**
Complete Stage 9 (create + connect the Blob store), then **Redeploy**.

**`next/image` error about a remote host.**
Allowed image hosts are set in `next.config.ts` (`images.unsplash.com` for sample
photos and `*.vercel-storage.com` for uploads). If you reference images hosted
elsewhere, add that hostname to `images.remotePatterns` and redeploy.

**The `/admin` page keeps redirecting to login.**
Clear your browser cookies for the site and sign in again. Ensure `AUTH_SECRET` is
the same value across all environments (a mismatch invalidates the session).

**Build fails on Vercel but works locally.**
Vercel builds from the committed code — make sure you `git add -A && git commit &&
git push` everything (including `package-lock.json`, `next.config.ts`, `db/`,
`lib/`, `app/`). Check the Vercel build log for the exact error.

---

## Quick reference

**Environment variables**

| Name | Example | Source |
|---|---|---|
| `DATABASE_URL` | `postgres://u:p@ep-x-pooler...neon.tech/neondb?sslmode=require` | Neon (pooled) |
| `AUTH_SECRET` | `9f8a...` (44 chars) | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | `studio@georgegeranios.com` | you choose |
| `ADMIN_PASSWORD` | `••••••••••••` | you choose |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_...` | Vercel Blob store |

**Commands (local)**

```bash
npm install
npm run db:push      # create tables in Neon (with DATABASE_URL set)
npm run db:seed      # optional: sample content
npm run dev          # local dev → http://localhost:3000
npm run build        # production build (what Vercel runs)
```

**Useful URLs**

- Public site: `https://<project>.vercel.app/`
- Admin: `https://<project>.vercel.app/admin/login`
- Vercel dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Neon dashboard: [console.neon.tech](https://console.neon.tech)

---

*That's it — you're live on Vercel with a working CMS. From now on, just `git push`
to update the site, or edit content in `/admin`.*
