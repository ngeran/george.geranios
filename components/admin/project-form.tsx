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

      <div className="grid grid-cols-2 gap-gutter">
        <Field label="Edition">
          <Input name="edition" defaultValue={defaults?.edition ?? ""} />
        </Field>
        <Field label="Series">
          <Input name="series" defaultValue={defaults?.series ?? ""} />
        </Field>
      </div>

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
        <Field label="Weight (sort order)">
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
        <span className="text-sm">Featured (shown on home)</span>
      </label>

      <ImageInput name="image" label="Cover image" defaultValue={defaults?.image ?? ""} />
      <GalleryInput name="gallery" label="Gallery images" defaultValue={defaults?.gallery ?? []} />

      <Field label="Description (body)">
        <Textarea name="body" rows={6} defaultValue={defaults?.body ?? ""} />
      </Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-gutter">
        <SubmitButton />
        <Link href="/admin/projects">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
