"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";
import { GalleryInput } from "@/components/admin/gallery-input";
import { Field, Section, SubmitBar } from "@/components/admin/form-primitives";

type Result = { error?: string } | null | void;
type Action = (prev: unknown, fd: FormData) => Result | Promise<Result>;

export type PublicationDefaults = {
  id?: number;
  title?: string | null;
  slug?: string | null;
  year?: number | null;
  date?: string | null;
  ref?: string | null;
  category?: string | null;
  publisher?: string | null;
  author?: string | null;
  isbn?: string | null;
  pages?: string | null;
  format?: string | null;
  edition?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  body?: string | null;
};

export function PublicationForm({
  action,
  defaults,
}: {
  action: Action;
  defaults?: PublicationDefaults;
}) {
  const [state, formAction] = useActionState(action, null);
  const error = (state as { error?: string } | null)?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {defaults?.id && <input type="hidden" name="id" value={defaults.id} />}

      <Section title="Basics">
        <Field label="Title" required>
          <Input name="title" defaultValue={defaults?.title ?? ""} required />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from the title.">
          <Input name="slug" defaultValue={defaults?.slug ?? ""} placeholder="catalogue-raisonne" />
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

      <Section title="Publication details">
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Publisher">
            <Input name="publisher" defaultValue={defaults?.publisher ?? ""} />
          </Field>
          <Field label="Author">
            <Input name="author" defaultValue={defaults?.author ?? ""} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="ISBN">
            <Input name="isbn" defaultValue={defaults?.isbn ?? ""} />
          </Field>
          <Field label="Pages">
            <Input name="pages" defaultValue={defaults?.pages ?? ""} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Format">
            <Input name="format" defaultValue={defaults?.format ?? ""} />
          </Field>
          <Field label="Edition">
            <Input name="edition" defaultValue={defaults?.edition ?? ""} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-gutter">
          <Field label="Reference">
            <Input name="ref" defaultValue={defaults?.ref ?? ""} />
          </Field>
          <Field label="Category">
            <Input name="category" defaultValue={defaults?.category ?? ""} />
          </Field>
        </div>
      </Section>

      <Section title="Images">
        <ImageInput name="image" label="Cover image" defaultValue={defaults?.image ?? ""} />
        <GalleryInput name="gallery" label="Gallery images" defaultValue={defaults?.gallery ?? []} />
      </Section>

      <Section title="Description" description="Separate paragraphs with a blank line.">
        <Textarea name="body" rows={6} defaultValue={defaults?.body ?? ""} />
      </Section>

      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitBar cancelHref="/admin/publications" />
    </form>
  );
}
