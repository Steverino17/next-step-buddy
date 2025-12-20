import { z } from "zod";
import { createMcpHandler } from "mcp-handler";

// IMPORTANT: This tells Vercel the runtime for this /api function.
export const config = {
  runtime: "nodejs",
};

const handler = createMcpHandler((server) => {
  server.tool(
    "next_step",
    "Gives one small next step so you can move forward",
    {
      goal: z.string().describe("What you want to achieve"),
      blocker: z.string().optional().describe("What feels in the way"),
    },
    async ({ goal, blocker }) => {
      const blockerText = blocker ? ` (even if "${blocker}" is still there)` : "";
      return {
        content: [
          {
            type: "text",
            text: `Do this next: take one small action that moves "${goal}" forward${blockerText}.`,
          },
        ],
      };
    }
  );
});

export default handler;
