"use server"

import { fetchUserContribution, getGithubToken } from "@/modules/github/lib/github"
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export async function getContributionStats(){
    try{
        const session=await auth.api.getSession({
            headers:await headers(),
        })

        if(!session?.user){
            throw new Error("Unauthorized")
        }

        const token = await getGithubToken()

        const octokit = new Octokit({ auth: token })

        const { data: user } = await octokit.rest.users.getAuthenticated()
        const username=user.login;

        const calendar =await fetchUserContribution(token,username);

        if(!calendar){
            return null
        }

        const contributions=calendar.weeks.flatMap((week:any)=>week.contributionDays)
        .map((day:any)=>({
            date:day.date,
            count:day.contributionCount,
            level:Math.min(4,Math.floor(day.contributionCount/3)),
        }))

        return {
            contributions:contributions,
            totalContributions:calendar.totalContributions
        }

    }catch(err){
        console.log(err)
        throw new Error("Failed to fetch contribution stats")
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

        //todo: fetch total connected repo from DB and replace this totalRepos with that
        const totalRepos = 300

        const calendar = await fetchUserContribution(token, user.login)
        const totalCommits = calendar?.totalContributions || 0

        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} type:pr`,
            sort: "created",
            order: "desc",
            per_page: 1
        })

        const totalPRs = prs.total_count

        //Todo : count AI review from database
        const totalReviews = 44

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

        calendar.weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                const date = new Date(day.date);
                const monthKey = monthNames[date.getMonth()];
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].commits += day.contributionCount;
                }
            })
        })

        // Fetch reviews from database for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // TODO: REVIEWS'S REAL DATA
        const generateSampleReviews = () => {
            const sampleReviews = [];
            const now = new Date();
            // Generate random reviews over the past 6 months
            for (let i = 0; i < 45; i++) {
                const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
                const reviewDate = new Date(now);
                reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);
                sampleReviews.push({
                    createdAt: reviewDate,
                });
            }
            return sampleReviews;
        };

        const reviews = generateSampleReviews()

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

    }
}

