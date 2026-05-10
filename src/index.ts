import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Coding Charter",
		version: "1.0.0",
	});

	async init() {
		// Returns one of the 8 charter principles by number
		this.server.registerTool(
			"get_principle",
			{
				description: "Returns one of the 8 guiding principles from the Coding Project charter, by number (1-8).",
				inputSchema: { number: z.number().int().min(1).max(8) },
			},
			async ({ number }) => {
				const principles: Record<number, { title: string; body: string }> = {
					1: { title: "Fun first", body: "If a thread stops being fun, change it or kill it. No guilt." },
					2: { title: "Build to learn, not learn to build", body: "Concepts get introduced when a project needs them, not before." },
					3: { title: "Small wins compound", body: "A working ugly thing beats a beautiful unfinished thing." },
					4: { title: "Don't be precious", body: "Threads are cheap. Restart, fork, abandon as needed." },
					5: { title: "No monetization pressure", body: "This isn't a side hustle. If something here ever earns money, that's a happy accident, not a goal." },
					6: { title: "Be a fellow learner with my son, not a teacher", body: "Walk one room over, not one step ahead." },
					7: { title: "Good practices come from pain, not rulebooks", body: "Stay open to learning conventions and patterns when projects start hurting in ways those practices would solve. Don't front-load." },
					8: { title: "Protect the buzz", body: "The energy at the start of a new project is fuel. Don't burn it on setup, checklists, or excessive discovery." },
				};

				const p = principles[number];
				return {
					content: [{
						type: "text",
						text: `Principle ${number}: ${p.title}\n\n${p.body}`,
					}],
				};
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
