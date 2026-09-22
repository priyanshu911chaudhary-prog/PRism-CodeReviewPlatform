import {inngest} from "../../../../inngest/client";
import {getDiff} from "../../../../modules/github/lib/github"
import { retrieveContext } from "../../../../modules/ai/lib/rag";
import { generateText } from "ai";
import {google} from "@ai-sdk/google";
import prisma from "../../../../lib/db";
import { postReviewComment } from "../../../../modules/github/lib/github";

export const generateReview=inngest.createFunction({
    id:"generate-review",
    concurrency:{limit:5},
    triggers:{
        event: "pr.review.requested"
    }
}, async({event,step})=>{
        const {owner,repo,prNumber,userId}=event.data;
        const {diff,title,description,token}=await step.run("fetch-pr-data",async()=>{
            const account=await prisma.account.findFirst({
                where:{
                    userId:userId,
                    providerId:"github"
                }
            })
            if(!account ||!account.accessToken){
                throw new Error("No github account found for user")
            }
            const diff=await getDiff(account.accessToken,owner,repo,prNumber);
            return {...diff,token:account.accessToken}
        })
        const context=await step.run("retrieve-context",async()=>{
            const query=`PR Title: ${title}\nPR Description: ${description}`;
            return await retrieveContext(query,`${owner}/${repo}`,3);
        })
        const review=await step.run("generate-review",async()=>{
            const {text}=await generateText({
                model:google("gemini-3.6-flash"),
                prompt:`
                Review the following Pull Request for the codebase.

                PR Title: ${title}
                PR Description: ${description}
                Diff: ${diff.diff}

                Context from codebase:
                ${context.join("\n\n")}

                Provide a detailed review including:
                1. Code quality
                2. Best practices
                3. Potential bugs
                4. Security vulnerabilities
                5. Performance improvements
                6. Test coverage
                7. Documentation
                8. Style and formatting

                Structure your review as follows:
                # Code Quality
                ...

                # Best Practices
                ...

                # Potential Bugs
                ...

                # Security Vulnerabilities
                ...

                # Performance Improvements
                ...

                # Test Coverage
                ...

                # Documentation
                ...

                # Style and Formatting
                ...

                and format your response in mardown
                `,
            })
            return text;
        })

        await step.run("post-comment",async()=>{
            await postReviewComment(token,owner,repo,prNumber,review)
        })

        await step.run("save-review",async()=>{
            const repository=await prisma.repository.findFirst({
                where:{
                    name:repo,
                    owner:owner
                }
            })
            if(!repository){
                throw new Error("Repository not found")
            }
            await prisma.review.create({
                data:{
                    prNumber:prNumber,
                    prUrl:`https://github.com/${owner}/${repo}/pull/${prNumber}`,
                    repositoryId:repository.id,
                    prTitle:title,
                    review:review,
                    status:"Completed"
                }
            })
        })
        return {success:true,}
    }
);