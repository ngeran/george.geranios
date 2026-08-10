"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin";

/** Permanently delete an uploaded blob. */
export async function deleteBlob(url: string): Promise<void> {
  await requireAdmin();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url);
  } catch (e) {
    console.error("[media] deleteBlob failed", e);
  }
  revalidatePath("/admin/media");
}
