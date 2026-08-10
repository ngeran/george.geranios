"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";
import { GalleryInput } from "@/components/admin/gallery-input";
import { Field, Section, SubmitBar } from "@/components/admin/form-primitives";

type Result = { error?: string } | null | void;
type Action = (prev: unknown, fd: FormData) => Result | Promise<Result>;

export type ProjectDefaults = {
  id?: number;
  title?: string | null;
  slug?: string | null;
  year?: number | null;
  date?: string | null;
  ref?: string | null;
  category?: string | null;
  location?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  edition?: string | null;
  availability?: string | null;
  series?: string | null;
  featured?: boolean | null;
  weight?: number | null;
  image?: string | null;
  gallery?: string[] | null;
  body?: string | null;
};

export function ProjectForm({
  action,
  defaults,
}: {
  action: Action;
  defaults?: ProjectDefaults;
}) {
  const [state, formAction] = useActionState(action, null);
  const error = (state as { error?: string } | null)?.error;
  const AVAIL = ["for-sale", "sold", "reserved", "not-for-sale"];

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {defaults?.id && <input type="hidden" name="id" value={defaults.id} />}

      <Section title="Basics">
        <Field label="Title" required>
          <Input name="title" defaultValue={defaults?.title ?? ""} required />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from the title.">
          <Input name="slug" defaultValue={defaults?.slug ?? ""} placeholder="the-grid" />
        </Field>
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Year">
            <Input name="year" type="number" defaultValue={defaults?.year ?? ""} />
          </Field>
          <Field label="Date">
            <Input name="date" type="date" defaultValue={defaults?.date ?? ""} />
          </Field>
        </div>
      </Section>

      <Section title="Classification">
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Category">
            <Input name="category" defaultValue={defaults?.category ?? ""} />
          </Field>
          <Field label="Series">
            <Input name="series" defaultValue={defaults?.series ?? ""} />
          </Field>
        </div>
        <Field label="Reference">
          <Input name="ref" defaultValue={defaults?.ref ?? ""} />
        </Field>
      </Section>

      <Section title="Physical">
        <Field label="Location">
          <Input name="location" defaultValue={defaults?.location ?? ""} />
        </Field>
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Medium">
            <Input name="medium" defaultValue={defaults?.medium ?? ""} />
          </Field>
          <Field label="Dimensions">
            <Input name="dimensions" defaultValue={defaults?.dimensions ?? ""} />
          </Field>
        </div>
        <Field label="Edition">
          <Input name="edition" defaultValue={defaults?.edition ?? ""} />
        </Field>
      </Section>

      <Section title="Display & availability">
        <div className="grid grid-cols-2 gap-gutter items-end">
          <Field label="Availability">
            <select
              name="availability"
              defaultValue={defaults?.availability ?? "not-for-sale"}
              className="w-full bg-background border border-input h-10 px-3"
            >
              {AVAIL.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Weight" hint="Lower sorts first.">
            <Input name="weight" type="number" defaultValue={defaults?.weight ?? 1} />
          </Field>
        </div>
        <label className="flex items-center gap-unit">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={!!defaults?.featured}
            className="h-4 w-4"
          />
          <span className="text-sm">Featured — shown on the home hero</span>
        </label>
      </Section>

      <Section title="Images">
        <ImageInput name="image" label="Cover image" defaultValue={defaults?.image ?? ""} />
        <GalleryInput name="gallery" label="Gallery images" defaultValue={defaults?.gallery ?? []} />
      </Section>

      <Section title="Description" description="Separate paragraphs with a blank line.">
        <Textarea name="body" rows={6} defaultValue={defaults?.body ?? ""} />
      </Section>

      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitBar cancelHref="/admin/projects" />
    </form>
  );
}
