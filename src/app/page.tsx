import { requireAuth } from "@/modules/auth/utils/authUtils";
import { redirect } from "next/navigation";

export default async function Home() {
  await requireAuth();
  redirect(`/dashboard`);
}
