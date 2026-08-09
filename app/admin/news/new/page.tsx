import { AdminHeader } from "@/components/admin/admin-header";
import { NewsForm } from "@/components/admin/news-form";
import { createNews } from "../actions";

export const dynamic = "force-dynamic";

export default function NewNewsPage() {
  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="New news item" />
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
