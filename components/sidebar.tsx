"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/available", label: "Available Works" },
  { href: "/news", label: "News" },
  { href: "/about", label: "Biography" },
  { href: "/contact", label: "Contact" },
];

export function Sidebar({
  contactEmail,
  contactInstagramUrl,
}: {
  contactEmail: string | null;
  contactInstagramUrl: string | null;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    path === href || (!!path && path !== "/" && path.startsWith(href));

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
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
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="lg:hidden text-on-surface-variant hover:text-primary p-2"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-background border-b border-structural-gray px-edge-margin-mobile py-gutter flex flex-col gap-gutter shadow-lg">
          <nav className="flex flex-col gap-gutter">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`font-display text-label-caps uppercase transition-colors ${
                  isActive(n.href)
                    ? "text-primary font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-structural-gray pt-gutter">
            <ModeToggle />
          </div>
        </div>
      )}
    </aside>
  );
}
