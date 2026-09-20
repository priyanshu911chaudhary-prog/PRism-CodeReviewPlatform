import { inngest } from "../../../../inngest/client";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: { event: "app/hello.world" },
  },
  async ({ event, step }) => {
    const result = await step.run("say-hello", async () => {
      return {
        message: `Hello ${event.data.name}!`,
      };
    });

    return result;
  },
);