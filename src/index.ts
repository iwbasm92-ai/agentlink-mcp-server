#!/usr/bin/env node

/**
 * AgentLink Korea - MCP Server Entry Point
 *
 * Starts the MCP server with stdio transport for local integration
 * with Claude Desktop, Claude Code, and other MCP-compatible clients.
 *
 * Usage:
 *   npx agentlink-mcp-server
 *   node dist/index.js
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Failed to start AgentLink MCP server:", error);
  process.exit(1);
});
