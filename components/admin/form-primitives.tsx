"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/** Shared, on-brand building blocks for the admin CMS forms. */

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-structural-gray p-gutter">
      <header className="mb-gutter">
        <h2 className="font-display text-label-caps uppercase text-on-surface-variant">{title}</h2>
        {description && (
          <p className="font-body text-caption text-on-surface-variant mt-1">{description}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SubmitBar({
  cancelHref,
  submitLabel = "Save",
  disabled,
}: {
  cancelHref: string;
  submitLabel?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-gutter border-t border-structural-gray pt-gutter">
      <Button type="submit" disabled={pending || disabled}>
        {pending ? "Saving…" : submitLabel}
      </Button>
      <Link href={cancelHref}>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </Link>
    </div>
  );
}
