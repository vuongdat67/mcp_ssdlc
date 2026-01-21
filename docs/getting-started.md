# Getting Started

This guide will help you get up and running with the MCP SSDLC Security Toolkit in minutes.

## Prerequisites

- **Node.js** v18 or higher
- **pnpm** (recommended) or npm
- An MCP-compatible client:
  - Claude Desktop App
  - VS Code with Copilot
  - Cursor IDE
  - Windsurf IDE

## Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vuongdat67/mcp_ssdlc
cd mcp-ssdlc-security-toolkit
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build the Project

```bash
pnpm build
```

## Configuration

### Claude Desktop App

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": ["path/to/mcp-ssdlc-security-toolkit/dist/index.js"]
    }
  }
}
```

### VS Code

The toolkit includes a `.vscode/mcp.json` configuration file that automatically configures the MCP server for VS Code.

## Your First Pipeline

Once configured, ask your AI assistant:

> "Design a secure user authentication system for a fintech application. Use TypeScript and deploy to AWS. Run the full SSDLC pipeline."

The toolkit will automatically:
1. Detect the domain (fintech)
2. Generate user stories and security requirements
3. Create technical design with pseudocode
4. Perform threat modeling
5. Design test strategy
6. Generate CI/CD pipeline

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build the TypeScript project |
| `pnpm dev` | Run in development mode with hot reload |
| `pnpm start` | Run the compiled MCP server |
| `pnpm test` | Run the test suite |
| `pnpm lint` | Run ESLint |

## Next Steps

- Learn about [Configuration Options](./configuration.md)
- Explore [Available Tools](./api/tools.md)
- Understand [Domain System](./domains/overview.md)
- Try [Example Projects](./guides/healthcare.md)
