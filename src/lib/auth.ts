import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // your prisma client instance
import { polar, checkout, portal, usage } from "@polar-sh/better-auth"
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
              productId: "854f55e7-2166-4afd-a8f6-a5708b2a83ac",
              slug: "PRism" // Custom slug for easy reference in Checkout URL, e.g. /checkout/PRism
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }),
        portal({
          returnUrl: process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000",
        }),
        usage(),
      ],
    })
  ]
});