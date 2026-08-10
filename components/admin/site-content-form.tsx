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
        <div className="grid grid-cols-2 gap-gutter">
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

      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitBar cancelHref="/admin" disabled={disabled} />
    </form>
  );
}
