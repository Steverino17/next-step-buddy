import { z } from "zod";
import { createMcpHandler } from "mcp-handler";

const handler = createMcpHandler((server) => {
  server.tool(
    "next_step",
    "Gives one small next step so you can move forward",
    {
      goal: z.string().min(1).describe("What you want to achieve"),
      blocker: z.string().optional().describe("What feels in the way"),
    },
    async ({ goal, blocker }) => {
      const cleanGoal = goal.trim();
      const cleanBlocker = (blocker ?? "").trim();

      const blockerText = cleanBlocker
        ? ` (even if "${cleanBlocker}" is still there).`
        : ".";

      return {
        content: [
          {
            type: "text",
            text: `Next step: take one small action that moves "${cleanGoal}" forward${blockerText}`,
          },
        ],
      };
    }
  );
});

export default handler;
