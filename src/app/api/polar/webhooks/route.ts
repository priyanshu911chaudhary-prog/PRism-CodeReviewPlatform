import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { prisma } from "@/lib/db";
import {
  updateUserTier,
  updatePolarCustomerId,
  SubscriptionTier,
} from "@/modules/payment/lib/subscription";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
  };

  const secret = process.env.POLAR_WEBHOOK_SECRET!;

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, headers) as typeof event;
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "subscription.active": {
        const customerId = event.data.customerId;

        const user = await prisma.user.findFirst({
          where: { polarCustomerId: customerId },
        });

        if (!user) break;

        await updateUserTier(user.id, "PRO", "ACTIVE", event.data.id);
        break;
      }

      case "subscription.canceled": {
        const customerId = event.data.customerId;

        const user = await prisma.user.findFirst({
          where: { polarCustomerId: customerId },
        });

        if (!user) break;

        await updateUserTier(
          user.id,
          user.subscriptionTier as SubscriptionTier,
          "CANCELED",
          event.data.id
        );
        break;
      }

      case "subscription.revoked": {
        const customerId = event.data.customerId;

        const user = await prisma.user.findFirst({
          where: { polarCustomerId: customerId },
        });

        if (!user) break;

        await updateUserTier(user.id, "FREE", "EXPIRED");
        break;
      }

      case "order.paid": {
        break;
      }

      case "customer.created": {
        if (!event.data.email) break;

        const user = await prisma.user.findUnique({
          where: { email: event.data.email },
        });

        if (!user) break;

        await updatePolarCustomerId(user.id, event.data.id);
        break;
      }

      default:
        break;
    }
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
