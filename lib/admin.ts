import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/session";

/** Defense-in-depth: re-check the session inside server actions. */
export async function requireAdmin() {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    throw new Error("Unauthorized");
  }
}
