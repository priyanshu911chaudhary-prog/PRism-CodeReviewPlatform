"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRepositories } from "@/modules/github/lib/github";

export const fetchRepositories = async (page:number,perPage:number) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session?.user) {
            throw new Error("Unauthorized")
        }
        const repos = await getRepositories(page,perPage);

        const dbRepos = await prisma.repository.findMany({
            where: {
                userId: session.user.id
            }
        })

        const connectedRepo=new Set(dbRepos.map((repo)=>repo.githubId))

        return repos.map((repo:any)=>{
            return{
                ...repo,
                isConnected:connectedRepo.has(BigInt(repo.id))
            }
        })
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch repositories")
    }
}