import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "../actions";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="New project" />
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
