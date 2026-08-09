import { AdminHeader } from "@/components/admin/admin-header";
import { PublicationForm } from "@/components/admin/publication-form";
import { createPublication } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPublicationPage() {
  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="New publication" />
        <PublicationForm action={createPublication} />
      </div>
    </div>
  );
}
