import type { Metadata } from "next";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const c = await getSiteContent();

  return (
    <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-3">
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase tracking-tighter">
            Contact
          </h1>
        </div>
        <div className="lg:col-span-8 lg:col-start-5 max-w-2xl">
          {c.contactIntro && (
            <p className="font-body text-body-lg text-on-surface mb-section-gap">
              {c.contactIntro}
            </p>
          )}
          <dl className="font-body text-body-lg text-on-surface space-y-6">
            {c.contactEmail && (
              <div>
                <dt className="font-display text-label-caps uppercase text-on-surface-variant mb-1">
                  Studio
                </dt>
                <dd>
                  <a href={`mailto:${c.contactEmail}`} className="underline hover:text-primary">
                    {c.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {(c.contactInstagramHandle || c.contactInstagramUrl) && (
              <div>
                <dt className="font-display text-label-caps uppercase text-on-surface-variant mb-1">
                  Instagram
                </dt>
                <dd>
                  <a
                    href={c.contactInstagramUrl || "https://instagram.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    {c.contactInstagramHandle || "Instagram"}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
