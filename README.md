# MCP SSDLC Security Toolkit v2.0

[![CI](https://github.com/vuongdat67/mcp_ssdlc/actions/workflows/ci.yml/badge.svg)](https://github.com/vuongdat67/mcp_ssdlc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

An intelligent, domain-aware Security Software Development Life Cycle (SSDLC) toolkit powered by the Model Context Protocol (MCP). It helps Tech Leads, Security Engineers, and Developers orchestrate secure software design, generate pseudocode, and manage compliance.

## 🌟 Key Features

- **Domain-Agnostic Core**: Built-in support for **Healthcare (HIPAA)**, **Fintech (PCI-DSS)**, **Blockchain**, **Secure Communications**, and 12+ more domains. Easily extensible to ANY domain via YAML plugins.
- **Tech Lead Automation**: Generates **Pseudocode** (Python, TS, Java, Go, C#, C++, Rust), Architecture Diagrams (Mermaid), DFD/ERD, and Module Breakdowns from user stories.
- **Full Pipeline Orchestration**: One command to run BA → Tech Design → Threat Modeling → QA Strategy → CI/CD Planning → ADR Generation.
- **Multi-format Export**: Output to JSON, YAML, Markdown, or professional SRS documents.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Installation](#installation)
- [Configuration](#-configuration)
- [Available Tools](#-available-tools)
- [Domains](#-domains)
- [Docker](#-docker)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vuongdat67/mcp_ssdlc
cd mcp-ssdlc-security-toolkit

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## 💻 Configuration

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

The project includes `.vscode/mcp.json` for automatic configuration.

### Docker

```bash
# Build and run with Docker
docker build -t mcp-ssdlc-toolkit .
docker run -it mcp-ssdlc-toolkit

# Or use docker-compose
docker-compose up ssdlc
```

## 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `list_domains` | List all available domain plugins |
| `load_domain` | Load a specific domain |
| `detect_domain` | Auto-detect domain from description |
| `ba_analyze_requirements` | Generate user stories and security requirements |
| `techlead_design` | Generate technical design and pseudocode |
| `security_threat_model` | Generate STRIDE threat model |
| `qa_design_test_strategy` | Generate test strategy |
| `devops_design_cicd` | Generate CI/CD pipeline |
| `orchestrate_ssdlc_pipeline` | Run complete SSDLC pipeline |

## 🌍 Domains

### Built-in Domains

| Domain | Compliance | Use Case |
|--------|------------|----------|
| `healthcare` | HIPAA | Patient records, telemedicine |
| `fintech` | PCI-DSS | Payments, banking |
| `blockchain` | - | Smart contracts, DeFi |
| `secure_comm` | GDPR | E2EE messaging |
| `appsec` | OWASP | Security tooling |
| `ml_ai` | - | ML model security |
| `malware_analysis` | - | Malware research |
| And 10+ more... | | |

### Custom Domains

Create custom domains by adding YAML files to `domains/custom/`:

```yaml
# domains/custom/ecommerce/domain.yaml
name: "ecommerce"
keywords: ["shop", "cart", "checkout"]
stakeholders:
  - name: "Shopper"
    type: "end_user"
sensitiveData:
  - type: "Payment Data"
    level: "critical"
```

## 🐳 Docker

```bash
# Development mode
docker-compose up ssdlc-dev

# Production mode
docker-compose up ssdlc

# Run tests
docker-compose run test
```

## 📚 Documentation

Full documentation available in the [`docs/`](./docs/) directory:

- [Getting Started](./docs/getting-started.md)
- [Installation Guide](./docs/installation.md)
- [Configuration](./docs/configuration.md)
- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api/tools.md)
- [Domain System](./docs/domains/overview.md)
- [Creating Custom Domains](./docs/domains/creating-domains.md)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Lint
pnpm lint
```

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features:

- **v2.1**: AI Integration, Interactive CLI, Domain Marketplace
- **v2.5**: Real-time Collaboration, Version Control, Third-party Integrations
- **v3.0**: Visual Domain Designer, SBOM, Threat Intelligence Feeds

## 🛠️ Tech Stack

| Feature | Supported Options |
|---------|-------------------|
| **Pseudocode Language** | Python, TypeScript, Java, Go, C#, C++, Rust |
| **Cloud Target** | Kubernetes, AWS, Azure, GCP, Docker |
| **Repo Platform** | GitHub, GitLab, Bitbucket |
| **Export Formats** | JSON, YAML, Markdown, SRS |

## 🤖 Orchestration Example

Ask your AI assistant:

> "Design a secure E-wallet system for fintech. Use TypeScript and deploy to AWS. Run the full SSDLC pipeline."

The agent will call `orchestrate_ssdlc_pipeline` and generate:
- User stories and security requirements
- Technical design with pseudocode
- STRIDE threat model
- Test strategy
- CI/CD pipeline
- Architecture Decision Records (ADRs)
- Project plan with cost estimation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Made with ❤️ by the MCP SSDLC team
