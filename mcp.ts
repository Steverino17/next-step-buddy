import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "Next Step",
  version: "1.0.0",
});

server.tool(
  "next_step",
  {
    goal: "string",
    blocker: "string",
  },
  async ({ goal, blocker }) => {
    return {
      content: [
        {
          type: "text",
          text: `Do this next: take one small action that moves "${goal}" forward, even if "${blocker}" isn’t fully resolved yet.`,
        },
      ],
    };
  }
);

export default server;
