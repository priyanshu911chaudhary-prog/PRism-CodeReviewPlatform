import { Octokit } from "octokit"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"

export const getGithubToken = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            throw new Error("No valid session found")
        }
        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                providerId: "github"
            }
        })
        if (!account) {
            throw new Error("No github account found")
        }
        if (!account.accessToken) {
            throw new Error("No github access token found")
        }
        return account.accessToken
    } catch (err) {
        console.log(err)
        throw new Error("Failed to fetch github token")
    }
}

export async function fetchUserContribution(token: string, username: string) {

    const octokit = new Octokit({
        auth: token
    })

    const query = `
        query($username: String!) {
            user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                totalContributions
                weeks {
                    contributionDays {
                        contributionCount
                        date
                        color
                        }
                    }
                }
            }
        }
    }`;

    // interface contributionData{
    //     user:{
    //         contributionCollection:{
    //             contributionCalendar:{
    //                 totalContributions:number,
    //                 weeks:{
    //                     contributionCount:number,
    //                     date:string | Date,
    //                     color:string
    //                 }
    //             }
    //         }
    //     }
    // }

    try {
        const res:any = await octokit.graphql(query, { username })
        return res.user.contributionsCollection.contributionCalendar
    }catch(err){
        console.log(err)
        throw new Error("Failed to fetch user contribution")
    }
}

export const getRepositories=async(page:number=1,perPage:number=10)=>{
    try{
        const token =await getGithubToken();
        const octokit=new Octokit({auth:token});

        const {data}=await octokit.rest.repos.listForAuthenticatedUser({
            per_page:perPage,
            page:page,
            type:"owner",
            sort:"updated",
            direction:"desc",
        });
        return data;
    }catch(err){
        console.log(err);
        throw new Error("Failed to fetch repositories");
    }
}