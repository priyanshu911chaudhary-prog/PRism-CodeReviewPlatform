import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // your prisma client instance

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
  ]
});