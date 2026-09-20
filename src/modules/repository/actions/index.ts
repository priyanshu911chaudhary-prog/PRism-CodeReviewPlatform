"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createWebhook, getRepositories } from "@/modules/github/lib/github";
import { revalidatePath } from "next/cache";
import { inngest } from "@/inngest/client";
export const fetchRepositories = async (page: number, perPage: number) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session?.user) {
            throw new Error("Unauthorized")
        }
        const repos = await getRepositories(page, perPage);

        const dbRepos = await prisma.repository.findMany({
            where: {
                userId: session.user.id
            }
        })

        const connectedRepo = new Set(dbRepos.map((repo) => repo.githubId))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return repos.map((repo: any) => {
            return {
                ...repo,
                isConnected: connectedRepo.has(BigInt(repo.id))
            }
        })
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch repositories")
    }
}

export const connectRepository = async (owner: string, repo: string, githubId: number) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    //todo : check if user can connect more repo

    try {
        const webhook = await createWebhook(owner, repo);

        console.log("=== CONNECT REPOSITORY DEBUG ===");
        console.log("owner:", owner);
        console.log("repo:", repo);
        console.log("githubId:", githubId);
        console.log("session.user.id:", session.user.id);
        console.log("webhook:", webhook);

        if (webhook) {

            console.log("webhook.created_at:", webhook.created_at);
            console.log("webhook.updated_at:", webhook.updated_at);

            await prisma.repository.create({
                data: {
                    githubId: BigInt(githubId),
                    name: repo,
                    owner: owner,
                    fullName: `${owner}/${repo}`,
                    url: `https://github.com/${owner}/${repo}`,
                    userId: session.user.id,
                    createdAt: new Date(webhook.created_at),
                    updatedAt: new Date(webhook.updated_at)
                }
            })
        }

        //todo: increment repository count for usage tracking

        try{
            await inngest.send({
                name:"repository.connected",
                data:{
                    owner,
                    repo,
                    userId: session.user.id,
                }
            })
        }catch(err){
            console.log("Failed to send event",err);
        }

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/repository");

        return webhook;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to connect repository");
    }
}