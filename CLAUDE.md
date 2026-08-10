# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

The Nix devShell (loaded by direnv) provides `node` + `just`. Deploys to Vercel — there is **no** Nix-image/k3s path here (unlike the default pipeline assumption on this machine).

| What | Command |
|---|---|
| Dev server (HMR) | `npm run dev` → http://localhost:3000 |
| Production build (runs `tsc` + compile) | `npm run build` |
| Type-check only | `npx tsc --noEmit` |
| Push schema to DB | `npm run db:push` |
| Seed sample content | `npm run db:seed` |
| Drizzle Studio | `npm run db:studio` |

`just` mirrors these: `just dev` / `just build` / `just db-push` / `just db-seed` / `just db-studio`.

**No test runner or lint script is configured** (no `npm test` / `npm run lint`). Type-safety comes from `tsc`, which runs as part of `next build`.

## Architecture

Photography portfolio + single-admin CMS. Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · shadcn/ui (`base-nova` style, see `components.json`).

**Data layer — the one design decision to internalize:**
- `lib/db.ts` builds a Drizzle-over-Neon (HTTP/serverless driver) client **only when `DATABASE_URL` is non-empty**; otherwise it exports `db = null`.
- `lib/data.ts` is the sole read surface (`getProjects`, `getNews`, …). Every function short-circuits to seed data (`db/seed-data.ts`) when `db` is null → **the public site renders fully with no database.** When adding a query, mirror this seed-fallback.
- Schema lives in `db/schema.ts` (tables: `projects`, `publications`, `news`). Migrations are **push-based** (`drizzle-kit push`); there is no hand-edited SQL migration folder.

**Rendering — why `next build` touches the database:**
- Public pages are async Server Components with `export const revalidate = 60` (ISR); `[slug]` routes implement `generateStaticParams()` via the data layer.
- So when `DATABASE_URL` is set, **the build queries the live DB to enumerate and prerender slugs.** If that DB has no tables yet, the build fails with `Error: Failed query: …` from `lib/data.ts`. Fix: `npm run db:push` (then `npm run db:seed`) against that same `DATABASE_URL`. With `DATABASE_URL` empty, the build falls back to seed data and succeeds.

**Admin & auth:**
- `/admin/*` is guarded by `proxy.ts` (formerly `middleware.ts` in Next 16) via a jose-signed JWT in an HttpOnly cookie (`lib/session.ts`). Single admin — no user table. Credentials are the env vars `ADMIN_EMAIL` / `ADMIN_PASSWORD`; signing key is `AUTH_SECRET`.
- Admin pages are `force-dynamic`. Writes go through Server Actions in `app/admin/<resource>/actions.ts`, each guarded by `requireAdmin()` (`lib/admin.ts`, defense-in-depth) and ending with `revalidatePath(...)` to refresh the ISR pages.
- Image uploads: `app/api/upload/route.ts` → Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Allowed `next/image` hosts live in `next.config.ts` (`images.unsplash.com` for seed photos, `*.vercel-storage.com` for uploads).

## Environment

Five vars (see `.env.example`). The only one that changes app *behavior* (vs. merely enabling a feature) is **`DATABASE_URL`**: empty/unset → seed fallback, no DB; set → live DB, and `next build` then requires the schema to exist. The rest: `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`.

## Deploy

`git push` → GitHub → Vercel auto-build. **Vercel does not run DB migrations** — run `npm run db:push` once from a machine that has the production `DATABASE_URL`. Full step-by-step (Neon, env vars, Blob, custom domain, troubleshooting) lives in `DEPLOY-VERCEL.md` and `README.md`.

## Next.js 16 notes (this is NOT stock Next.js)

Per `@AGENTS.md`: read `node_modules/next/dist/docs/` before trusting memorized Next.js APIs — this version has breaking changes. Two things already relevant here:
- **`middleware.ts` → `proxy.ts`.** The `middleware` file convention is deprecated; rename the file and its exported function to `proxy` (the `config.matcher` is unchanged), or run `npx @next/codemod@canary middleware-to-proxy .`.
- The "managed block" in `AGENTS.md` is rewritten by `next dev`, so an uncommitted diff there is expected — committing it keeps the tree clean.
