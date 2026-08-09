import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/admin/login/actions";

/** Shared admin top bar: view-site link + sign out. */
export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-structural-gray pb-gutter mb-section-gap">
      <div className="flex items-baseline gap-gutter">
        <span className="font-display text-headline-md uppercase">{title}</span>
        <Link
          href="/"
          className="font-body text-caption text-on-surface-variant hover:text-primary uppercase"
        >
          ← View site
        </Link>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </header>
  );
}
