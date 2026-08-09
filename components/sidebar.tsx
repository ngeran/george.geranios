"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/available", label: "Available Works" },
  { href: "/news", label: "News" },
  { href: "/about", label: "Biography" },
  { href: "/contact", label: "Contact" },
];

export function Sidebar() {
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || (!!path && path !== "/" && path.startsWith(href));

  return (
    <aside className="fixed top-0 left-0 z-50 w-full h-16 lg:h-screen lg:w-[248px] bg-background/90 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-structural-gray flex items-center lg:items-stretch justify-between lg:flex-col px-edge-margin-mobile lg:px-0">
      {/* Name — one line */}
      <div className="lg:px-gutter lg:pt-gutter flex items-center lg:block">
        <Link href="/" className="block">
          <span className="font-display text-[18px] lg:text-[22px] leading-none tracking-tight text-primary whitespace-nowrap uppercase">
            George Geranios
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-gutter lg:flex-col lg:items-stretch lg:gap-0 lg:px-gutter lg:mt-6 overflow-x-auto whitespace-nowrap">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`font-display text-label-caps uppercase whitespace-nowrap transition-colors lg:py-2 ${
              isActive(n.href)
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {n.label}
          </Link>
        ))}
        <div className="lg:py-2 lg:self-start">
          <ModeToggle />
        </div>
      </nav>

      {/* Contact — bottom (desktop only) */}
      <div className="hidden lg:block px-gutter lg:mt-auto lg:pb-gutter">
        <div className="border-t border-structural-gray pt-gutter space-y-1">
          <a
            href="mailto:studio@example.com"
            className="block font-body text-caption text-on-surface-variant hover:text-primary"
          >
            studio@example.com
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-body text-caption text-on-surface-variant hover:text-primary"
          >
            Instagram
          </a>
        </div>
      </div>
    </aside>
  );
}
