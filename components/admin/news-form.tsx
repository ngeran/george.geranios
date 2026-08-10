"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";
import { Field, Section, SubmitBar } from "@/components/admin/form-primitives";

type Result = { error?: string } | null | void;
type Action = (prev: unknown, fd: FormData) => Result | Promise<Result>;

export type NewsDefaults = {
  id?: number;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  summary?: string | null;
  image?: string | null;
  body?: string | null;
};

export function NewsForm({
  action,
  defaults,
}: {
  action: Action;
  defaults?: NewsDefaults;
}) {
  const [state, formAction] = useActionState(action, null);
  const error = (state as { error?: string } | null)?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {defaults?.id && <input type="hidden" name="id" value={defaults.id} />}

      <Section title="News item">
        <Field label="Title" required>
          <Input name="title" defaultValue={defaults?.title ?? ""} required />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from the title.">
          <Input name="slug" defaultValue={defaults?.slug ?? ""} placeholder="new-exhibition" />
        </Field>
        <Field label="Date">
          <Input name="date" type="date" defaultValue={defaults?.date ?? ""} />
        </Field>
        <Field label="Summary" hint="One-line summary shown in the news list.">
          <Textarea name="summary" rows={3} defaultValue={defaults?.summary ?? ""} />
        </Field>
      </Section>

      <Section title="Image">
        <ImageInput
          name="image"
          label="Image (optional)"
          defaultValue={defaults?.image ?? ""}
          note="Shown at the top of the article and in the news list."
        />
      </Section>

      <Section title="Body" description="Separate paragraphs with a blank line.">
        <Textarea name="body" rows={8} defaultValue={defaults?.body ?? ""} />
      </Section>

      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitBar cancelHref="/admin/news" />
    </form>
  );
}
