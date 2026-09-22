"use server"

import { fetchUserContribution, getGithubToken } from "@/modules/github/lib/github"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
import prisma from "@/lib/db";

export async function getContributionStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const token = await getGithubToken()

        const octokit = new Octokit({ auth: token })

        const { data: user } = await octokit.rest.users.getAuthenticated()
        const username = user.login;

        const calendar = await fetchUserContribution(token, username);

        if (!calendar) {
            return null
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contributions = calendar.weeks.flatMap((week: any) => week.contributionDays)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((day: any) => ({
                date: day.date,
                count: day.contributionCount,
                level: Math.min(4, Math.floor(day.contributionCount / 3)),
            }))

        return {
            contributions: contributions,
            totalContributions: calendar.totalContributions
        }

    } catch (err) {
        console.error("[getContributionStats] Failed:", err)
        return null
    }
}

export async function getDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const token = await getGithubToken()
        const octokit = new Octokit({ auth: token })

        const { data: user } = await octokit.rest.users.getAuthenticated()

        // Fetch total connected repos from DB
        const totalRepos = await prisma.repository.count({
            where: { userId: session.user.id }
        })

        const calendar = await fetchUserContribution(token, user.login)
        const totalCommits = calendar?.totalContributions || 0

        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} type:pr`,
            sort: "created",
            order: "desc",
            per_page: 1
        })

        const totalPRs = prs.total_count

        // Count AI reviews from database (through user's connected repositories)
        const totalReviews = await prisma.review.count({
            where: {
                repository: {
                    userId: session.user.id
                }
            }
        })

        return {
            totalCommits,
            totalPRs,
            totalReviews,
            totalRepos
        }

    } catch (err) {
        console.log(err)
        // throw new Error("Failed to fetch user contribution")
        return {
            totalCommits: 0,
            totalPRs: 0,
            totalReviews: 0,
            totalRepos: 0
        }
    }
}

export async function getMonthlyActivity() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const token = await getGithubToken()
        const octokit = new Octokit({ auth: token })

        const { data: user } = await octokit.rest.users.getAuthenticated()

        const calendar = await fetchUserContribution(token, user.login)

        if (!calendar) {
            throw new Error("Failed to fetch user contribution")
        }

        const monthlyData: {
            [key: string]: {
                commits: number;
                prs: number;
                reviews: number
            }
        } = {}

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        //initalizing 6 months
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = monthNames[date.getMonth()];
            monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        calendar.weeks.forEach((week: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            week.contributionDays.forEach((day: any) => {
                const date = new Date(day.date);
                const monthKey = monthNames[date.getMonth()];
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].commits += day.contributionCount;
                }
            })
        })

        // Fetch real reviews from database for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const reviews = await prisma.review.findMany({
            where: {
                repository: {
                    userId: session.user.id
                },
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                createdAt: true
            }
        })

        reviews.forEach((review) => {
            const monthKey = monthNames[review.createdAt.getMonth()];
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].reviews += 1;
            }
        })

        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
            per_page: 100,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prs.items.forEach((pr: any) => {
            const date = new Date(pr.created_at);
            const monthKey = monthNames[date.getMonth()];
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].prs += 1;
            }
        });

        return Object.keys(monthlyData).map((name) => ({
            name,
            ...monthlyData[name]
        }))


    } catch (err) {
        console.log(err);
        return [];
    }
}

