# Configuration Guide

This guide covers all configuration options for the MCP SSDLC Security Toolkit.

## MCP Server Configuration

### Claude Desktop

Location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### VS Code (mcp.json)

Location: `.vscode/mcp.json` in your project root

```json
{
  "servers": {
    "ssdlc-toolkit": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"],
      "env": {}
    }
  }
}
```

### Cursor / Windsurf

Most MCP-compatible editors support similar configuration. Check your editor's documentation for MCP server setup.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `DOMAINS_PATH` | Custom domains directory | `./domains` |

## Tool Configuration

### Target Languages

Supported pseudocode languages:

| Language | Identifier |
|----------|------------|
| Python | `python` |
| TypeScript | `typescript` |
| Java | `java` |
| Go | `go` |
| C# | `csharp` |
| C++ | `cpp` |
| Rust | `rust` |

### Deployment Targets

| Target | Identifier | Description |
|--------|------------|-------------|
| Kubernetes | `kubernetes` | K8s manifests |
| AWS | `aws` | CloudFormation/CDK |
| Azure | `azure` | ARM templates |
| GCP | `gcp` | Deployment Manager |
| Docker | `docker` | Docker Compose |

### Repository Platforms

| Platform | Identifier | CI/CD Format |
|----------|------------|--------------|
| GitHub | `github` | GitHub Actions |
| GitLab | `gitlab` | GitLab CI |
| Bitbucket | `bitbucket` | Bitbucket Pipelines |

## Domain Configuration

### Using Built-in Domains

Available domains:
- `healthcare` - HIPAA compliance
- `fintech` - PCI-DSS compliance
- `blockchain` - DLT/Smart contracts
- `secure_comm` - E2EE messaging
- `appsec` - Application security
- `networksec` - Network security
- `websec` - Web security
- `ml_ai` - Machine learning
- `malware_analysis` - Malware research
- `reverse_engineering` - RE tooling
- `devops` - DevOps automation
- `devsecops` - Security in DevOps
- `soc` - Security operations

### Creating Custom Domains

1. Create folder: `domains/custom/<your-domain>/`
2. Add `domain.yaml`:

```yaml
name: "ecommerce"
keywords: ["shop", "cart", "checkout", "retail", "order"]
stakeholders:
  - name: "Shopper"
    type: "end_user"
  - name: "Merchant"
    type: "admin"
sensitiveData:
  - type: "Credit Card"
    level: "critical"
  - type: "Address"
    level: "high"
dataClassification:
  critical:
    - "payment_data"
  high:
    - "customer_pii"
  medium:
    - "order_history"
  low:
    - "product_catalog"
```

3. Add `compliance.yaml` (optional):

```yaml
regulations:
  - name: "PCI-DSS"
    fullName: "Payment Card Industry Data Security Standard"
    requirements:
      - id: "PCI-1"
        name: "Secure Network"
        description: "Install and maintain firewall"
```

4. Add `threats.yaml` (optional):

```yaml
threats:
  - name: "Payment Fraud"
    category: "Spoofing"
    likelihood: "high"
    impact: "critical"
```

5. Restart the MCP server

## Output Configuration

### Export Formats

| Format | Use Case |
|--------|----------|
| `json` | API integration, processing |
| `yaml` | Human-readable, version control |
| `markdown` | Documentation, reports |

### SRS Document

The SRS (Software Requirements Specification) document includes:
- Executive summary
- User stories
- Technical architecture
- Security requirements
- Threat model
- Test strategy
- CI/CD pipeline
- NFRs (Non-Functional Requirements)
- Traceability matrix
