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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await octokit.graphql(query, { username })
        return res.user.contributionsCollection.contributionCalendar
    } catch (err) {
        console.log(err)
        throw new Error("Failed to fetch user contribution")
    }
}

export const getRepositories = async (page: number = 1, perPage: number = 10) => {
    try {
        const token = await getGithubToken();
        const octokit = new Octokit({ auth: token });

        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            per_page: perPage,
            page: page,
            type: "owner",
            sort: "updated",
            direction: "desc",
        });
        return data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch repositories");
    }
}

export const createWebhook = async (owner: string, repo: string) => {
    const token = await getGithubToken()
    const octokit = new Octokit({
        auth: token
    });
    const webhookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
        owner,
        repo,
    })
    const existingHook = hooks.find(hook => hook.config.url === webhookURL);
    if (existingHook) {
        console.log("Webhook already exists")
        return existingHook;
    }
    const { data } = await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
            url: webhookURL,
            content_type: "json",
        },
        events: ["push", "pull_request"],
        active: true
    })
    return data;
}

export const deleteWebhook = async (owner: string, repo: string) => {
    const token = await getGithubToken();
    const octokit = new Octokit({
        auth: token
    });
    const webhookURL = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;
    try {
        const { data: hooks } = await octokit.rest.repos.listWebhooks({
            owner,
            repo,
        })
        const existingHook = hooks.find(hook => hook.config.url === webhookURL);
        if (existingHook) {
            await octokit.rest.repos.deleteWebhook({
                owner,
                repo,
                hook_id: existingHook.id
            })
        }
        return { success: true }
    } catch (err) {
        console.log(err);
        throw new Error("Failed to delete webhook");
    }
}

export async function getRepoFileContents(
    token: string,
    owner: string,
    repo: string,
    path: string = ""
): Promise<{ path: string, content: string }[]> {
    const octokit = new Octokit({
        auth: token
    });
    try {
        const { data: file } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path
        });
        if (!Array.isArray(file)) {
            if (file.type === "file" && "content" in file && typeof file.content === 'string') {
                return [{
                    path: file.path,
                    content: Buffer.from(file.content, "base64").toString("utf-8")
                }]
            }
            return []
        }
        let files: { path: string, content: string }[] = [];
        for (const item of file) {
            if (item.type === "file") {
                const { data: fileData } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: item.path
                })
                if (!Array.isArray(fileData) && fileData.type === "file" && "content" in fileData && typeof fileData.content === 'string') {
                    // Filter out non-code files if needed (images, etc.)
                    // For now, let’s include everything that looks like text
                    if (!item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
                        files.push({
                            path: item.path,
                            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
                        });
                    }
                }
            }else if(item.type === "dir"){
                const subFiles=await getRepoFileContents(
                    token,
                    owner,
                    repo,
                    item.path
                )
                files=files.concat(subFiles);
            }
        }
        return files;
    } catch (err) {
        console.error(err);
        throw err;
    }
}