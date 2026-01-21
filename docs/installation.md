# Installation Guide

This guide provides detailed installation instructions for different environments.

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | v18.x | v20.x or v22.x |
| Memory | 512MB | 1GB+ |
| Disk Space | 100MB | 500MB |
| OS | Windows/macOS/Linux | Any |

## Installation Methods

### Method 1: From Source (Recommended)

```bash
# Clone the repository
git clone https://github.com/vuongdat67/mcp_ssdlc
cd mcp-ssdlc-security-toolkit

# Install dependencies with pnpm (recommended)
pnpm install

# Or with npm
npm install

# Build the project
pnpm build
```

### Method 2: Docker

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/vuongdat67/mcp_ssdlc:latest

# Or build locally
docker build -t mcp-ssdlc-toolkit .

# Run with docker-compose
docker-compose up ssdlc
```

### Method 3: Development Mode

```bash
# Run with hot reload for development
pnpm dev
```

## Platform-Specific Setup

### Windows

1. Ensure Node.js is in your PATH
2. Use PowerShell or Windows Terminal
3. Configuration file location: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": ["D:\\path\\to\\mcp-ssdlc-security-toolkit\\dist\\index.js"]
    }
  }
}
```

### macOS

1. Install Node.js via Homebrew: `brew install node`
2. Install pnpm: `brew install pnpm`
3. Configuration file location: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": ["/Users/yourname/mcp-ssdlc-security-toolkit/dist/index.js"]
    }
  }
}
```

### Linux

1. Install Node.js via your package manager or nvm
2. Install pnpm: `npm install -g pnpm`
3. Configuration file location: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": ["/home/yourname/mcp-ssdlc-security-toolkit/dist/index.js"]
    }
  }
}
```

## Verification

After installation, verify the toolkit is working:

1. Restart your MCP client (Claude Desktop, VS Code, etc.)
2. Ask: "List available domains"
3. You should see: healthcare, fintech, blockchain, secure_comm, etc.

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Run `pnpm build` first |
| Permission denied | Check file permissions on dist/index.js |
| Server not starting | Verify Node.js version with `node --version` |
| Domains not loading | Check domains/ directory exists |

### Getting Help

- Check [GitHub Issues](https://github.com/vuongdat67/mcp_ssdlc/issues)
- Review logs in your MCP client
- Run `node dist/index.js` directly to see error messages
