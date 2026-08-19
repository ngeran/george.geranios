"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";
import { Field, Section, SubmitBar } from "@/components/admin/form-primitives";
import type { SiteContent } from "@/db/seed-data";

type Result = { error?: string } | null | void;
type Action = (prev: unknown, fd: FormData) => Result | Promise<Result>;

export function SiteContentForm({
  action,
  defaults,
  disabled,
}: {
  action: Action;
  defaults: SiteContent;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const error = (state as { error?: string } | null)?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <Section title="Contact" description="Email and Instagram also appear in the site sidebar.">
        <Field label="Intro line">
          <Input name="contactIntro" defaultValue={defaults.contactIntro ?? ""} />
        </Field>
        <Field label="Studio email">
          <Input name="contactEmail" type="email" defaultValue={defaults.contactEmail ?? ""} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
          <Field label="Instagram handle">
            <Input
              name="contactInstagramHandle"
              defaultValue={defaults.contactInstagramHandle ?? ""}
            />
          </Field>
          <Field label="Instagram URL">
            <Input
              name="contactInstagramUrl"
              defaultValue={defaults.contactInstagramUrl ?? ""}
            />
          </Field>
        </div>
      </Section>

      <Section title="Biography">
        <ImageInput
          name="aboutPortrait"
          label="Portrait image"
          defaultValue={defaults.aboutPortrait ?? ""}
          note="Shown at the top of the Biography page."
        />
        <Field label="Bio" hint="Separate paragraphs with a blank line.">
          <Textarea name="aboutBio" rows={8} defaultValue={defaults.aboutBio ?? ""} />
        </Field>
        <Field label="Exhibitions" hint="One per line.">
          <Textarea name="aboutExhibitions" rows={5} defaultValue={defaults.aboutExhibitions ?? ""} />
        </Field>
      </Section>

      <Section title="Available Works">
        <Field label="Heading">
          <Input name="availableHeading" defaultValue={defaults.availableHeading ?? ""} />
        </Field>
        <Field label="Intro / footer line">
          <Textarea name="availableIntro" rows={3} defaultValue={defaults.availableIntro ?? ""} />
        </Field>
      </Section>

      <Section
        title="Home hero"
        description="Optional. Hero images come from Projects marked Featured. Leave blank to show the featured project's title and year."
      >
        <Field label="Hero title (overrides project title)">
          <Input name="heroTitle" defaultValue={defaults.heroTitle ?? ""} />
        </Field>
        <Field label="Hero subtitle">
          <Input name="heroSubtitle" defaultValue={defaults.heroSubtitle ?? ""} />
        </Field>
      </Section>

      <Section
        title="Navigation"
        description="Labels shown in the site sidebar and mobile menu. Leave blank to use the default."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
          <Field label="Projects label">
            <Input name="navProjectsLabel" defaultValue={defaults.navProjectsLabel ?? ""} placeholder="Projects" />
          </Field>
          <Field label="Available Works label">
            <Input name="navAvailableLabel" defaultValue={defaults.navAvailableLabel ?? ""} placeholder="Available Works/Prints" />
          </Field>
          <Field label="Biography label">
            <Input name="navAboutLabel" defaultValue={defaults.navAboutLabel ?? ""} placeholder="Biography" />
          </Field>
          <Field label="Contact label">
            <Input name="navContactLabel" defaultValue={defaults.navContactLabel ?? ""} placeholder="Contact" />
          </Field>
        </div>
        <label className="flex items-center gap-unit">
          <input
            type="checkbox"
            name="navShowPublications"
            defaultChecked={!!defaults.navShowPublications}
            className="h-4 w-4"
          />
          <span className="text-sm">Show Publications in the menu</span>
        </label>
        <label className="flex items-center gap-unit">
          <input
            type="checkbox"
            name="navShowNews"
            defaultChecked={!!defaults.navShowNews}
            className="h-4 w-4"
          />
          <span className="text-sm">Show News in the menu</span>
        </label>
      </Section>

      <Section
        title="Project categories"
        description="One per line. These become the Category dropdown options when editing a Project."
      >
        <Field label="Categories">
          <Textarea
            name="projectCategories"
            rows={5}
            defaultValue={defaults.projectCategories ?? ""}
            placeholder={"Architecture\nLandscape\nMusic\nSeries"}
          />
        </Field>
      </Section>

      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitBar cancelHref="/admin" disabled={disabled} />
    </form>
  );
}
