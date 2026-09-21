import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // your prisma client instance
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth"
import { updateUserTier, updatePolarCustomerId } from "@/modules/payment/lib/subscription";
import { polarClient } from "@/modules/payment/config/polar";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["repo"]
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://sympathy-cause-jaywalker.ngrok-free.dev",
  ],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5a7313b6-570b-41cd-910d-90d229d92cfd",
              slug: "PRism" // Custom slug for easy reference in Checkout URL, e.g. /checkout/PRism
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }),
        portal({
          returnUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard`,
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET as string,
          onSubscriptionActive: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findFirst({
              where: {
                polarCustomerId: customerId
              }
            });

            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id)
            }

          },
          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findFirst({
              where: {
                polarCustomerId: customerId
              }
            });

            if (user) {
              await updateUserTier(user.id, user.subscriptionTier as any, "CANCELED")
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findFirst({
              where: {
                polarCustomerId: customerId
              }
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED")
            }
          },
          onOrderPaid: async () => {},
          onCustomerCreated: async (payload) => {
            const user = await prisma.user.findUnique({
              where: {
                email:payload.data.email as string
              }
            });

            if (user) {
              await updatePolarCustomerId(user.id,payload.data.id)
            }
          }
        })
      ],
    })
  ]
});