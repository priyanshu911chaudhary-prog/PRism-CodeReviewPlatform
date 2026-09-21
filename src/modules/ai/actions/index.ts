"use server";

import prisma from "@/lib/db";
import { getDiff } from "@/modules/github/lib/github";
import { indexCodebase } from "@/modules/ai/lib/rag";
import { inngest } from "@/inngest/client";
// import { createCommitComment } from "@/modules/github/lib/github";

export async function reviewPullRequest(owner:string,repo:string,prNumber:number){
    try{
        const repository=await prisma.repository.findFirst({
            where: {
                name: repo,
                owner: owner,
            },
            include:{
                user:{
                    include:{
                        accounts:{
                            where:{
                                providerId:"github",
                            }
                        }
                    }
                }
            }
        })
        
        if(!repository) throw new Error(`Repository ${owner}/${repo} not found`);

        const githubAccount=repository.user.accounts[0];

        if(!githubAccount?.accessToken){
            throw new Error("No Github access token found for repository owner")
        }

        const token=githubAccount.accessToken;
        
        const {title}=await getDiff(token,owner,repo,prNumber);

        await inngest.send({
            name:"pr.review.requested",
            data:{
                owner,
                repo,
                prNumber,
                userId:repository.user.id
            }
        })

        return {success:true,message:`PR ${title} queued for review`}

    }catch(err){
        try{
            const repository=await prisma.repository.findFirst({
                where:{
                    name:repo,
                    owner:owner
                }
            })

            if(repository){
                await prisma.review.create({
                    data:{
                        prNumber:prNumber,
                        prUrl:`https://github.com/${owner}/${repo}/pull/${prNumber}`,
                        repositoryId:repository.id,
                        prTitle:"Failed to fetch PR",
                        review:`Error: ${err instanceof Error ? err.message : "Unknown error"}`,
                        status:"Failed"
                    }
                })
            }
            return {success:false,message:err instanceof Error ? err.message : "Unknown error"}
        }catch(err){
            return {success:false,message:err instanceof Error ? err.message : "Unknown error"}
        }
    }
}