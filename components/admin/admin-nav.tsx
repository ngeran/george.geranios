"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/publications", label: "Publications" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/media", label: "Media" },
];

/** Persistent admin section nav. Hidden on the login screen. */
export function AdminNav() {
  const path = usePathname();
  if (path === "/admin/login") return null;

  const isActive = (href: string) =>
    path === href || (href !== "/admin" && !!path && path.startsWith(href));

  return (
    <nav className="sticky top-0 z-40 border-b border-structural-gray bg-background/95 backdrop-blur">
      <div className="max-w-[1100px] mx-auto flex items-center gap-gutter px-edge-margin-mobile lg:px-gutter py-gutter overflow-x-auto whitespace-nowrap">
        <span className="font-display text-label-caps uppercase text-on-surface-variant shrink-0">
          Admin
        </span>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`font-display text-label-caps uppercase whitespace-nowrap transition-colors ${
              isActive(n.href)
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
