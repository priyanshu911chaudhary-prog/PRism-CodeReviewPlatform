import prisma from "@/lib/db";
import { inngest } from "../../../../inngest/client";
import { getRepoFileContents } from "@/modules/github/lib/github";
import { indexCodebase } from "@/modules/ai/lib/rag";

export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
    triggers: {
      event: "repository.connected"
    }
  },
  async ({ event, step }) => {

    const { owner, repo, userId } = event.data;

    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github"
        }
      });

      if (!account?.accessToken) throw new Error("Account or access token not found");

      return await getRepoFileContents(account.accessToken, owner, repo)
    })

    await step.run("index-codebase", async () => {
      console.log(`Starting indexing for ${owner}/${repo}`);
      console.log(`Files to index: ${files.length}`);

      await indexCodebase(`${owner}/${repo}`, files);

      console.log(`Finished indexing ${owner}/${repo}`);
    });

    return { success: true, indexedFiles: files.length }
  }
)