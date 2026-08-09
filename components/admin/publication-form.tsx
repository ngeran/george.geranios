"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";
import { GalleryInput } from "@/components/admin/gallery-input";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

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

      <Field label="Title">
        <Input name="title" defaultValue={defaults?.title ?? ""} required />
      </Field>

      <Field label="Slug (leave blank to auto-generate)">
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

      <div className="grid grid-cols-2 gap-gutter">
        <Field label="Reference">
          <Input name="ref" defaultValue={defaults?.ref ?? ""} />
        </Field>
        <Field label="Category">
          <Input name="category" defaultValue={defaults?.category ?? ""} />
        </Field>
      </div>

      <Field label="Publisher">
        <Input name="publisher" defaultValue={defaults?.publisher ?? ""} />
      </Field>

      <Field label="Author">
        <Input name="author" defaultValue={defaults?.author ?? ""} />
      </Field>

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

      <ImageInput name="image" label="Cover image" defaultValue={defaults?.image ?? ""} />
      <GalleryInput name="gallery" label="Gallery images" defaultValue={defaults?.gallery ?? []} />

      <Field label="Description (body)">
        <Textarea name="body" rows={6} defaultValue={defaults?.body ?? ""} />
      </Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-gutter">
        <SubmitButton />
        <Link href="/admin/publications">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
