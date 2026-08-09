import Link from "next/link";
import { getProjects, getPublications, getNews } from "@/lib/data";
import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, publications, news] = await Promise.all([
    getProjects(),
    getPublications(),
    getNews(),
  ]);

  const cards = [
    { href: "/admin/projects", label: "Projects", count: projects.length },
    { href: "/admin/publications", label: "Publications", count: publications.length },
    { href: "/admin/news", label: "News", count: news.length },
  ];

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="Dashboard" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block border border-structural-gray p-section-gap hover:bg-surface-container-low transition-colors"
            >
              <div className="font-display text-display-xl-mobile text-primary">
                {c.count}
              </div>
              <div className="font-display text-label-caps uppercase text-on-surface-variant mt-unit">
                {c.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
