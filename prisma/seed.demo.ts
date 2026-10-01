import { config } from 'dotenv';
config();
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { hashPassword } from 'better-auth/crypto';

let connectionString = process.env.DATABASE_URL || '';
connectionString = connectionString.replace('&channel_binding=require', '');
connectionString = connectionString.replace('?sslmode=verify-full', '?sslmode=require');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_USER_ID = "demo-user-1";

async function main() {
  console.log("Starting demo data seed...");

  // 1. Generate Repositories Data first so we know their IDs
  const repos = [
    { name: "prism-dashboard", desc: "PRism's web dashboard for AI-powered pull request reviews.", lang: "TypeScript" },
    { name: "commerce-api", desc: "Backend API for the PRism demo commerce platform.", lang: "TypeScript" },
    { name: "auth-service", desc: "Authentication and authorization service.", lang: "TypeScript" },
    { name: "notification-service", desc: "Notification and email processing service.", lang: "TypeScript" },
    { name: "analytics-engine", desc: "Analytics processing and reporting service.", lang: "Python" }
  ];

  const repoRecordsData = repos.map((r, i) => ({
    id: `repo-${i + 1}`,
    githubId: BigInt(100000 + i),
    name: r.name,
    owner: "prism-demo-org",
    fullName: `prism-demo-org/${r.name}`,
    url: `https://github.com/prism-demo-org/${r.name}`,
    description: r.desc,
    language: r.lang,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  }));

  // 2. Generate Reviews Data
  const showcasePRs = [
    {
      repoId: repoRecordsData[0].id,
      prNumber: 142,
      prTitle: "fix: prevent duplicate webhook processing",
      status: "completed",
      daysAgo: 2,
      reviewText: `The pull request addresses the duplicate webhook issue but introduces some risks in error handling.

### ⚠️ High
**Webhook processing does not appear to be idempotent. Replayed webhook events could create duplicate processing records.**
*Location: \`src/api/webhooks/github.ts\` line 142*
*Status: OPEN*

### 🟡 Medium
**Missing error handling for rate limit.**
The fallback branch silently ignores the error, making production debugging difficult.
*Location: \`src/lib/webhooks/process.ts\` line 54*
*Status: FIXED*

### 🟡 Medium
**Repeated database query inside iteration.**
The current implementation performs one database query per event.
*Location: \`src/lib/webhooks/process.ts\` line 87*
*Status: DISMISSED*

### 🟢 Low
**Consider extracting this logic to a separate function.**
*Location: \`src/api/webhooks/github.ts\` line 210*
*Status: OPEN*
`
    },
    {
      repoId: repoRecordsData[1].id,
      prNumber: 138,
      prTitle: "feat: optimize repository indexing pipeline",
      status: "completed",
      daysAgo: 5,
      reviewText: `The indexing pipeline is much faster, but there are critical security and performance issues.

### 🚨 Critical
**Potential sensitive token exposure in error logging.**
The authentication token is included in a debug-level log statement. Remove the token from logs to prevent accidental credential exposure.
*Location: \`src/services/repository.service.ts\` line 112*
*Status: FIXED*

### ⚠️ High
**The retry path can execute after the request context has already been closed, potentially resulting in an invalid operation.**
*Location: \`src/services/indexing.ts\` line 45*
*Status: OPEN*

### ⚠️ High
**Memory leak potential.**
The cache array is never cleared during batch processing.
*Location: \`src/services/indexing.ts\` line 201*
*Status: FIXED*

### 🟡 Medium (x3)
Several minor code quality issues regarding typing and imports.
`
    },
    {
      repoId: repoRecordsData[2].id,
      prNumber: 135,
      prTitle: "refactor: simplify authentication middleware",
      status: "completed",
      daysAgo: 10,
      reviewText: `The implementation is clean and consistent with the existing architecture. No blocking issues were detected.

Looks great! Safe to merge.`
    },
    {
      repoId: repoRecordsData[1].id,
      prNumber: 129,
      prTitle: "fix: handle failed payment webhook retries",
      status: "completed",
      daysAgo: 15,
      reviewText: `Good fix, but pay attention to the edge cases around timeouts.

### ⚠️ High
**Missing timeout for external payment gateway call.**
*Location: \`src/services/payment.ts\` line 88*
*Status: OPEN*

### 🟡 Medium
**This function is responsible for authentication, persistence, and response formatting. Consider separating these responsibilities.**
*Location: \`src/services/payment.ts\` line 42*
*Status: WONT_FIX*

### 🟡 Medium
**Magic numbers used for retry delays.**
*Location: \`src/services/payment.ts\` line 105*
*Status: FIXED*
`
    }
  ];

  const standardPRTitles = [
    "feat: add repository activity analytics",
    "fix: resolve dashboard loading state",
    "refactor: simplify repository service",
    "docs: update API integration guide",
    "test: improve authentication coverage",
    "fix: optimize repository synchronization",
    "feat: add bulk notification processing",
    "refactor: migrate repository queries",
    "fix: handle expired authentication tokens",
    "feat: add analytics aggregation",
    "chore: update dependencies",
    "fix: correct typo in settings UI",
    "feat: support dark mode toggle",
    "refactor: split large React components",
    "fix: memory leak in dashboard chart",
    "docs: clarify webhook payload structure",
    "test: add e2e tests for login flow",
    "feat: introduce rate limiting middleware",
    "fix: handle null response from GitHub API",
    "chore: clean up unused variables",
    "feat: user avatar upload"
  ];

  const allReviews = [...showcasePRs];
  for (let i = 0; i < standardPRTitles.length; i++) {
    const title = standardPRTitles[i];
    const repoRecord = repoRecordsData[i % repoRecordsData.length];
    const daysAgo = Math.floor(Math.random() * 45) + 1;
    let reviewText = "The pull request is generally well structured.";
    if (title.startsWith("feat")) {
        reviewText += "\n\n### 🟡 Medium\n**Consider adding unit tests for this new feature.**\n*Status: OPEN*";
    } else if (title.startsWith("fix")) {
        reviewText += "\n\n### 🟢 Low\n**Ensure this fix is covered by regression tests.**\n*Status: FIXED*";
    } else if (title.startsWith("refactor")) {
        reviewText += "\n\nNo significant issues found. The refactor improves maintainability.";
    }

    allReviews.push({
      repoId: repoRecord.id,
      prNumber: 100 + i,
      prTitle: title,
      status: Math.random() > 0.8 ? "failed" : "completed",
      daysAgo: daysAgo,
      reviewText: reviewText
    });
  }

  // 3. Compute dynamic usage
  const reviewsCounts: Record<string, number> = {};
  for (const r of allReviews) {
      reviewsCounts[r.repoId] = (reviewsCounts[r.repoId] || 0) + 1;
  }

  // 4. Upsert User
  console.log("Upserting demo user...");
  const user = await prisma.user.upsert({
    where: { email: "demo@prism.local" },
    update: {},
    create: {
      id: DEMO_USER_ID,
      name: "Aarav Sharma",
      email: "demo@prism.local",
      emailVerified: true,
      subscriptionTier: "PRO", // Corrected case for PRO mapping
      subscriptionStatus: "ACTIVE", // Corrected case
      polarCustomerId: "mock_polar_cus_123",
      polarSubscriptionId: "mock_polar_sub_123",
      usage: {
        create: {
          repositoriesCount: repoRecordsData.length,
          reviewsCounts: reviewsCounts // Correctly dynamically generated
        }
      }
    },
  });

  const hashedPassword = await hashPassword("Demo@123");
  await prisma.account.upsert({
    where: { id: `account-${DEMO_USER_ID}` },
    update: {
      password: hashedPassword
    },
    create: {
      id: `account-${DEMO_USER_ID}`,
      accountId: DEMO_USER_ID,
      providerId: "credential",
      userId: DEMO_USER_ID,
      password: hashedPassword,
      accessToken: "demo_token" // Satisfies GitHub integration tests
    }
  });

  // 5. Upsert Repositories
  console.log("Upserting repositories...");
  const repoRecords = [];
  for (const r of repoRecordsData) {
    const repoRecord = await prisma.repository.upsert({
      where: { githubId: r.githubId },
      update: {
        description: r.description,
        language: r.language
      },
      create: {
        id: r.id,
        githubId: r.githubId,
        name: r.name,
        owner: r.owner,
        fullName: r.fullName,
        url: r.url,
        userId: user.id,
        description: r.description,
        language: r.language,
        createdAt: r.createdAt,
      }
    });
    repoRecords.push(repoRecord);
  }

  // 6. Delete and Recreate Reviews
  console.log("Upserting reviews...");
  await prisma.review.deleteMany({
    where: { repository: { userId: DEMO_USER_ID } }
  });

  for (const r of allReviews) {
    const createdAt = new Date(Date.now() - r.daysAgo * 24 * 60 * 60 * 1000);
    const prUrl = `https://github.com/prism-demo-org/${repoRecordsData.find(re => re.id === r.repoId)?.name}/pull/${r.prNumber}`;
    console.log("Creating review:", r.repoId, r.prNumber, r.prTitle, r.status, prUrl, !!r.reviewText);
    await prisma.$executeRawUnsafe(`
      INSERT INTO "review" ("id", "repositoryId", "prNumber", "prTitle", "status", "prUrl", "review", "createdAt", "updatedAt", "headSha")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
    `, 
      crypto.randomUUID(), 
      r.repoId, 
      r.prNumber, 
      r.prTitle, 
      r.status, 
      prUrl, 
      r.reviewText,
      createdAt,
      "mock-sha-1234567890" // Matches undocumented required DB field
    );
  }

  console.log("✅ Demo data seeded successfully.");
  console.log("-----------------------------------------");
  console.log("Login Email: demo@prism.local");
  console.log("Login Password: Demo@123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
