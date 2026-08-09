# =========================================================================
# george-geranios — Next.js app
# =========================================================================
# Nix provides ONLY the devShell here (node + just). The app builds + deploys
# on Vercel (push → GitHub → Vercel auto-build) — there is no Nix image/k3s
# path in this repo. `direnv allow` loads this shell for local dev.
# =========================================================================
{
  description = "george-geranios — Next.js app (Nix devShell; deploys to Vercel)";

  inputs.nixpkgs.url = "nixpkgs/nixos-26.05";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      pkgsFor = system: nixpkgs.legacyPackages.${system};
    in {
      devShells = forAllSystems (system:
        let pkgs = pkgsFor system; in {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_22   # includes npm — `npm run dev` / `npm run build`
              just
            ];
            shellHook = ''
              echo ""
              echo "  ❯ george-geranios devshell (Next.js → Vercel)"
              echo "      node    $(node -v 2>/dev/null || echo '—')"
              echo "      dev     npm run dev   (→ http://localhost:3000)"
              echo "      build   npm run build"
              echo "      deploy  git push → GitHub → Vercel auto-build"
              echo "      db      npm run db:push && npm run db:seed"
              echo ""
            '';
          };
        });
    };
}
