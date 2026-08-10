import type { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = { title: "Biography" };

export default async function AboutPage() {
  const c = await getSiteContent();
  const paragraphs = (c.aboutBio ?? "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const exhibitions = (c.aboutExhibitions ?? "")
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-3">
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase tracking-tighter">
            Biography
          </h1>
        </div>
        <div className="lg:col-span-8 lg:col-start-5 max-w-2xl">
          {c.aboutPortrait && (
            <div className="mb-section-gap max-w-xs">
              <Image
                src={c.aboutPortrait}
                alt="Portrait of George Geranios"
                width={1000}
                height={1200}
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="font-body text-body-lg text-on-surface space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {exhibitions.length > 0 && (
              <>
                <h2 className="font-display text-headline-md uppercase pt-section-gap">
                  Selected solo exhibitions
                </h2>
                <ul className="space-y-1">
                  {exhibitions.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
