import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-3">
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase tracking-tighter">
            Contact
          </h1>
        </div>
        <div className="lg:col-span-8 lg:col-start-5 max-w-2xl">
          <p className="font-body text-body-lg text-on-surface mb-section-gap">
            For print sales, exhibition requests, and press enquiries.
          </p>
          <dl className="font-body text-body-lg text-on-surface space-y-6">
            <div>
              <dt className="font-display text-label-caps uppercase text-on-surface-variant mb-1">
                Studio
              </dt>
              <dd>
                <a
                  href="mailto:studio@example.com"
                  className="underline hover:text-primary"
                >
                  studio@example.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-label-caps uppercase text-on-surface-variant mb-1">
                Instagram
              </dt>
              <dd>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  @georgegeranios
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
