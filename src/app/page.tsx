export const instant = false;

import { requireAuth } from "@/modules/auth/utils/authUtils";
import { redirect } from "next/navigation";

export default async function Home() {
  try {
    await requireAuth();
  } catch {
    redirect("/login");
  }
  redirect("/dashboard");
}
