import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { getSiteContent, parseCategoryList } from "@/lib/data";
import { createProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const site = await getSiteContent();
  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="New project" />
        <ProjectForm
          action={createProject}
          categories={parseCategoryList(site.projectCategories)}
        />
      </div>
    </div>
  );
}
