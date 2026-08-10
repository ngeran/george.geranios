# Deploying George Geranios to Vercel

A Next.js 16 photography site with a built-in admin CMS (Neon Postgres + Vercel Blob). This guide takes the repo from your machine to a live Vercel site with a working admin.

> **Time:** ~20 min · **Cost:** $0 (everything fits in free tiers)
>
> The public site ships with built-in sample content, so it goes live the moment
> you deploy — **even before the database is set up.** The DB steps only make the
> **admin** able to save real edits. If the build can't reach the DB (or the
> tables aren't created yet), it simply renders the sample content and keeps
> going — it will not fail.

## What you need

Three free accounts:

- **GitHub** — [github.com](https://github.com) (hosts the code, triggers builds).
- **Vercel** — [vercel.com](https://vercel.com) (sign in with GitHub).
- **Neon** — [neon.tech](https://neon.tech) (the Postgres database).

---

## 1. Push the code to GitHub

Vercel builds from a GitHub repo.

```bash
git init -b main
git add -A && git commit -m "Next.js photography site"
git remote add origin git@github.com:<you>/george-geranios.git
git push -u origin main
```

Or create the empty repo at [github.com/new](https://github.com/new) first. HTTPS remote: `https://github.com/<you>/george-geranios.git`.

---

## 2. Create the Neon database

1. [neon.tech](https://neon.tech) → **Create project** → name it, pick a region.
2. Copy the **Pooled connection** string from the dashboard:
   ```
   postgres://<user>:<pass>@ep-abc123-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   It must contain **`-pooler`** and end with **`?sslmode=require`**. This is your **`DATABASE_URL`** — keep it secret (it has your DB password).

---

## 3. Gather your secrets

| Variable | Value | How to get it |
|---|---|---|
| `DATABASE_URL` | Neon pooled string | Step 2 |
| `AUTH_SECRET` | random ~44-char string | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | your admin login email | you choose |
| `ADMIN_PASSWORD` | your admin login password | you choose (strong) |
| `BLOB_READ_WRITE_TOKEN` | *(leave empty for now)* | Step 7 |

No `openssl`? `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

---

## 4. Import into Vercel + add env vars

1. [vercel.com/new](https://vercel.com/new) → sign in with GitHub.
2. **Import** the `george-geranios` repo.
3. Keep the auto-detected settings: **Framework Preset: Next.js**, **Root Directory: `./`**.
4. Expand **Environment Variables** and add each row from the table above to **all three environments** (Production, Preview, Development). Leave `BLOB_READ_WRITE_TOKEN` empty for now.
5. Click **Deploy**.

In 1–2 minutes you'll get a URL like `https://george-geranios.vercel.app`. **Open it** — the live photography site renders from the built-in sample data.

---

## 5. Create the database tables (so the admin can save)

Vercel does **not** run database migrations. Create the tables once, from your machine, against the **production** `DATABASE_URL`:

```bash
npm install
export DATABASE_URL="postgres://...-pooler...neon.tech/neondb?sslmode=require"   # from Step 2
npm run db:push     # creates the projects / publications / news tables
npm run db:seed     # optional: fill them with the sample content
```

> No local Node? Use the Vercel CLI: `npm i -g vercel`, `vercel link`, `vercel env pull .env`, then `npm run db:push && npm run db:seed`.

**Verify:** Neon → your project → **Tables** shows `projects`, `publications`, `news`.

---

## 6. Log in and add content

1. Open `https://<project>.vercel.app/admin/login`.
2. Sign in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. **Projects → + New project** → fill the fields, add a cover image → **Save**.
4. It appears on `/projects` within ~1 minute (ISR revalidates); on `/available` if `availability = for-sale`; on the home hero if `featured`.

(Image uploads need Step 7. Until then, paste image URLs instead.)

---

## 7. Enable image uploads (Vercel Blob)

1. Vercel → your project → **Storage** → **Create** → **Blob** → connect it.
2. This injects `BLOB_READ_WRITE_TOKEN`. If it isn't auto-added, copy the store's read-write token and add it under **Settings → Environment Variables** (all environments).
3. **Redeploy** so the token is live.

Uploads now work in the admin.

---

## 8. Custom domain (optional)

Vercel → **Settings → Domains → Add**. Point your registrar's DNS (A/CNAME) at Vercel per its instructions; Vercel provisions HTTPS automatically. Set it **Primary** once verified.

---

## Verification checklist

- [ ] `https://<project>.vercel.app` loads the site.
- [ ] `/admin/login` → sign in works.
- [ ] Created a project → it shows on `/projects`.
- [ ] `for-sale` → shows on `/available`; `featured` → can show on the home hero.
- [ ] Image upload works (after Step 7).
- [ ] Dark-mode toggle works.
- [ ] `git push` to `main` triggers a rebuild.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Site shows sample content, not my edits | Expected until the DB is set up. Run Step 5 (`db:push`/`db:seed`), then edit via the admin. |
| Admin: "Database not configured" | `DATABASE_URL` missing/empty on Vercel → add it (all environments) + **Redeploy**. Env vars only apply to deploys made *after* you add them. |
| `db:push` won't connect | Use the **pooled** Neon URL (`-pooler`, `?sslmode=require`) with the password. Neon free tier allows any IP. |
| Admin login always fails | `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `AUTH_SECRET` must be set in **Production** + redeployed. Email/password are case-sensitive. |
| Upload fails / "BLOB token not set" | Finish Step 7 (connect Blob) + **Redeploy**. |
| `next/image` remote-host error | Allowed hosts are in `next.config.ts` (`images.unsplash.com`, `*.vercel-storage.com`). Add yours + redeploy. |
| `/admin` redirects to login forever | Clear cookies; ensure `AUTH_SECRET` is identical across environments. |
| Build logs show `[data] … DB unavailable, rendering seed data` | The DB wasn't reachable at build time (tables not pushed yet). Harmless — run Step 5 so the admin can save. |

---

## Reference

```bash
npm install
npm run dev          # local dev → http://localhost:3000
npm run db:push      # create tables (needs DATABASE_URL)
npm run db:seed      # optional sample content
npm run build        # production build (what Vercel runs)
```

**Links:** Vercel — [vercel.com/dashboard](https://vercel.com/dashboard) · Neon — [console.neon.tech](https://console.neon.tech) · Admin — `https://<project>.vercel.app/admin/login`
