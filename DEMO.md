# PRism Demo Runbook

This document provides instructions on how to set up and run the PRism dashboard with realistic, deterministic seed data without relying on external GitHub API or AI API calls.

## Setup

1. **Start the database:**
   Make sure your PostgreSQL database is running and accessible as configured in your `.env` file.

2. **Seed the demo data:**
   Run the following command to populate the local database with deterministic demo data (users, repositories, PRs, findings, reviews).
   ```bash
   npm run seed:demo
   ```

3. **Start the application in Demo Mode:**
   You must set `NEXT_PUBLIC_DEMO_MODE=true` to enable the "Demo Account" login and safely bypass external GitHub API calls for the dashboard.
   ```bash
   # On Windows (PowerShell)
   $env:NEXT_PUBLIC_DEMO_MODE="true"; npm run dev

   # On Linux/macOS
   NEXT_PUBLIC_DEMO_MODE=true npm run dev
   ```

## Demo Credentials
Since we seeded the database and enabled Demo Mode, a demo login is available on the Sign In page.
- **Email:** `demo@prism.local`
- **Password:** `Demo@123`

*(Note: In Demo Mode, you can click the "Sign in with Demo Account" button directly on the login page.)*

## Demo Flow

A typical 3-5 minute presentation flow for PRism:

1. **Login:** Navigate to `http://localhost:3000/login` and click "Sign in with Demo Account".
2. **Dashboard Overview:** Discuss the top-level metrics (Total Repositories, Total Commits, Pull Requests, AI Reviews) and show the contribution activity and monthly activity charts.
3. **Repository Health:** Go to the "Repositories" tab. Explain how PRism connects to repositories and monitors activity. You'll see several realistically named repositories (e.g., `prism-dashboard`, `commerce-api`).
4. **Showcase AI Reviews:** Navigate to the "Reviews" tab to see history of AI code reviews.
5. **Open Showcase PRs:** Scroll through the reviews to highlight specific PRs designed to demonstrate PRism's AI capabilities.

### Showcase PRs Seeded in Demo

- **PR #142 (prism-dashboard): `fix: prevent duplicate webhook processing`**
  Demonstrates identifying reliability and performance issues in webhook processing (High & Medium findings).
  
- **PR #138 (commerce-api): `feat: optimize repository indexing pipeline`**
  Highlights PRism catching a **Critical** token exposure vulnerability and a memory leak, providing line-specific feedback.
  
- **PR #135 (auth-service): `refactor: simplify authentication middleware`**
  Shows how PRism handles clean code without raising false positives ("Looks great! Safe to merge.").
  
- **PR #129 (commerce-api): `fix: handle failed payment webhook retries`**
  Highlights PRism identifying a missing timeout and edge cases on external gateways.

## Resetting Demo Data
If you need to re-seed or reset the demo data, run:
```bash
npm run seed:demo:reset
```
*(This command runs the exact same idempotent upsert script, safely resetting only the demo user's data without destroying your developer database.)*
