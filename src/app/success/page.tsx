export const instant = false;

import { redirect } from "next/navigation";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout_id?: string }>;
}) {
    const params = await searchParams;
    const checkoutId = params.checkout_id;

    // Redirect to subscription page with success flag so it can sync
    redirect(`/dashboard/subscription?success=${checkoutId || "true"}`);
}
