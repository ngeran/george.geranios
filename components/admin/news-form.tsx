"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/admin/image-input";

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

      <Field label="Title">
        <Input name="title" defaultValue={defaults?.title ?? ""} required />
      </Field>

      <Field label="Slug (leave blank to auto-generate)">
        <Input name="slug" defaultValue={defaults?.slug ?? ""} placeholder="new-exhibition" />
      </Field>

      <Field label="Date">
        <Input name="date" type="date" defaultValue={defaults?.date ?? ""} />
      </Field>

      <Field label="Summary">
        <Textarea name="summary" rows={3} defaultValue={defaults?.summary ?? ""} />
      </Field>

      <ImageInput name="image" label="Image (optional)" defaultValue={defaults?.image ?? ""} />

      <Field label="Body">
        <Textarea name="body" rows={8} defaultValue={defaults?.body ?? ""} />
      </Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-gutter">
        <SubmitButton />
        <Link href="/admin/news">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
