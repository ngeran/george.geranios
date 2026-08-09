"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroProject = {
  slug: string;
  title: string;
  year: number;
  image: string;
};

/**
 * Full-screen hero that shows a different random project on each visit.
 * In Phase 1 the list is passed in (hardcoded sample data); Phase 2 passes
 * the DB projects.
 */
export function HomeHero({ projects }: { projects: HeroProject[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (projects.length) setIdx(Math.floor(Math.random() * projects.length));
  }, [projects.length]);

  const p = projects[idx];
  if (!p) return null;

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] lg:h-screen overflow-hidden bg-primary">
      <Link href={`/projects/${p.slug}`} className="block w-full h-full">
        <Image
          src={p.image}
          alt={p.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Link>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 px-edge-margin-mobile lg:px-gutter pb-gutter pt-24 bg-linear-to-t from-black/70 to-transparent">
        <span className="font-display text-label-caps text-white/80 uppercase">
          {p.year}
        </span>
        <span className="block font-display text-headline-md text-white uppercase">
          {p.title}
        </span>
      </div>
    </section>
  );
}
