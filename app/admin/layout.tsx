import { AdminNav } from "@/components/admin/admin-nav";

/** Wraps all /admin/* routes with the section nav. AdminNav hides itself on
 *  /admin/login so the sign-in screen stays uncluttered. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      {children}
    </div>
  );
}
