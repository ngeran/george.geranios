# =========================================================================
# george-geranios — Next.js app (local dev → Vercel)
# =========================================================================
# Nix provides the devShell (direnv via `.envrc` → `use flake`).
# The app deploys to Vercel: `git push` → GitHub → Vercel auto-build.
# There is no Nix image / k3s path in this repo.
# =========================================================================
set shell := ["bash", "-c"]

# Local dev server (HMR) → http://localhost:3000
dev:
    npm run dev

# Production build (type-checks + compiles).
build:
    npm run build

# Create / migrate the Neon schema (idempotent). Needs DATABASE_URL in .env.
db-push:
    npm run db:push

# Seed Neon with the sample content. Needs DATABASE_URL in .env.
db-seed:
    npm run db:seed

# Open Drizzle Studio (browse/edit the DB). Needs DATABASE_URL in .env.
db-studio:
    npm run db:studio

# Enter the Nix devShell manually (direnv usually does this for you).
shell:
    nix develop
