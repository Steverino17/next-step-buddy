import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "Next Step Buddy",
  version: "1.0.0",
});

server.tool(
  "next_step",
  {
    goal: "string",
    blocker: "string",
  },
  async ({ goal, blocker }) => {
    const response = await fetch("https://next-step-buddy.vercel.app/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal, blocker }),
    });

    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: data.result,
        },
      ],
    };
  }
);

export default server;
