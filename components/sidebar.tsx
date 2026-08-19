"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

export type NavConfig = {
  projectsLabel: string;
  availableLabel: string;
  aboutLabel: string;
  contactLabel: string;
  showPublications: boolean;
  showNews: boolean;
};

export function Sidebar({
  contactEmail,
  contactInstagramUrl,
  nav,
}: {
  contactEmail: string | null;
  contactInstagramUrl: string | null;
  nav: NavConfig;
}) {
  const path = usePathname();
  const NAV = [
    { href: "/projects", label: nav.projectsLabel || "Projects" },
    { href: "/available", label: nav.availableLabel || "Available Works/Prints" },
    ...(nav.showPublications ? [{ href: "/publications", label: "Publications" }] : []),
    ...(nav.showNews ? [{ href: "/news", label: "News" }] : []),
    { href: "/about", label: nav.aboutLabel || "Biography" },
    { href: "/contact", label: nav.contactLabel || "Contact" },
  ];
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    path === href || (!!path && path !== "/" && path.startsWith(href));

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ===== Top bar (mobile) / sidebar (desktop) ===== */}
      <aside className="fixed top-0 left-0 z-50 w-full h-16 lg:h-screen lg:w-[248px] bg-background/95 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-structural-gray flex items-center justify-between lg:flex-col px-edge-margin-mobile lg:px-0">
        {/* Brand */}
        <div className="lg:px-gutter lg:pt-gutter flex items-center lg:block">
          <Link href="/" className="block">
            <span className="font-display text-[18px] lg:text-[22px] leading-none tracking-tight text-primary whitespace-nowrap uppercase">
              George Geranios
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:flex-col lg:items-stretch lg:gap-0 lg:px-gutter lg:mt-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "font-display text-label-caps uppercase whitespace-nowrap transition-colors lg:py-2",
                isActive(n.href)
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              {n.label}
            </Link>
          ))}
          <div className="lg:py-2 lg:self-start">
            <ModeToggle />
          </div>
        </nav>

        {/* Desktop footer */}
        {(contactEmail || contactInstagramUrl) && (
          <div className="hidden lg:block px-gutter lg:mt-auto lg:pb-gutter">
            <div className="border-t border-structural-gray pt-gutter space-y-1">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="block font-body text-caption text-on-surface-variant hover:text-primary"
                >
                  {contactEmail}
                </a>
              )}
              {contactInstagramUrl && (
                <a
                  href={contactInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-caption text-on-surface-variant hover:text-primary"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="lg:hidden text-on-surface-variant hover:text-primary p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
      </aside>

      {/* ===== Mobile overlay menu ===== */}
      <div
        aria-hidden={!open}
        className={cn(
          "lg:hidden fixed inset-0 z-[60] bg-background flex flex-col transition-all duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        {/* Top row: brand + close */}
        <div className="flex items-center justify-between h-16 px-edge-margin-mobile border-b border-structural-gray shrink-0">
          <Link href="/" onClick={() => setOpen(false)} className="block">
            <span className="font-display text-[18px] leading-none tracking-tight text-primary whitespace-nowrap uppercase">
              George Geranios
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-on-surface-variant hover:text-primary p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center gap-gutter px-edge-margin-mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn(
                "font-display text-2xl uppercase tracking-tight py-1 transition-colors",
                isActive(n.href) ? "text-primary" : "text-on-surface-variant hover:text-primary",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Footer: theme + contact */}
        <div className="px-edge-margin-mobile py-gutter border-t border-structural-gray flex items-center justify-between shrink-0">
          <ModeToggle />
          {(contactEmail || contactInstagramUrl) && (
            <div className="flex flex-col items-end gap-1 font-body text-caption text-on-surface-variant">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="hover:text-primary">
                  {contactEmail}
                </a>
              )}
              {contactInstagramUrl && (
                <a
                  href={contactInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
