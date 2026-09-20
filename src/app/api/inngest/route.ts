import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { indexRepo } from "./functions/index";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo],
});