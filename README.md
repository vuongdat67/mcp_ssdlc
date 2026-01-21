# MCP SSDLC Security Toolkit v2.0

An intelligent, domain-aware Security Software Development Life Cycle (SSDLC) toolkit powered by the Model Context Protocol (MCP). It helps Tech Leads, Security Engineers, and Developers orchestrate secure software design, generate pseudocode, and manage compliance.

## 🌟 Key Features

*   **Domain-Agnostic Core**: Built-in support for **Healthcare (HIPAA)** and **Fintech (PCI-DSS)**. Easily extensible to ANY domain (E-commerce, Automotive, IoT) via YAML plugins.
*   **Tech Lead Automation**: Generates **Pseudocode** (Python, TS, Java, Go, C#), Architecture Diagrams (Mermaid), and Module Breakdowns from user stories.
*   **Full Pipeline Orchestration**: One command to run BA -> Tech Design -> Threat Modeling -> QA Strategy -> CI/CD Planning.
*   **Multi-format Export**: Output to JSON, YAML, or Markdown.

## 🚀 Getting Started

### Prerequisites

*   Node.js v18+
*   pnpm (recommended) or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/mcp-ssdlc-toolkit.git
    cd mcp-ssdlc-toolkit
    ```

2.  Install dependencies and build:
    ```bash
    pnpm install
    pnpm build
    ```

---

## 💻 Usage Configuration

### 1. Claude Desktop App

Add the server to your Claude Desktop configuration file:

*   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
*   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ssdlc-toolkit": {
      "command": "node",
      "args": [
        "D:\\source\\mcp-ssdlc-security-toolkit\\dist\\index.js"
      ]
    }
  }
}
```
*(Note: Replace the path with the actual absolute path to your `dist/index.js`)*

### 2. Editor Agents (Cursor, Windsurf, etc.)

Most MCP-compatible editors allow you to configure MCP servers in their settings or via a generic MCP command runner.

**Command:** `node`
**Args:** `path/to/dist/index.js`

---

## 🌍 How to Support ANY Domain

The toolkit is designed to be **pluggable**. You can support any industry (Gaming, Retail, Gov) by adding a new domain definition.

1.  Create a folder in `domains/custom/<your-domain>/`
2.  Add `domain.yaml`:
    ```yaml
    name: "ecommerce"
    keywords: ["shop", "cart", "checkout", "retail"]
    stakeholders:
      - name: "Shopper"
        type: "end_user"
    sensitiveData:
      - type: "Credit Card"
        level: "critical"
    ```
3.  (Optional) Add `compliance.yaml` and `threats.yaml` for specific rules.
4.  Restart the MCP server.

## 🛠️ Supported Tech Stack

| Feature | Supported Options |
| :--- | :--- |
| **Pseudocode Language** | Python, TypeScript, Java, Go, C# |
| **Cloud Target** | Kubernetes, AWS, Azure, GCP, Docker |
| **Repo Platform** | GitHub, GitLab, Bitbucket |
| **Export Formats** | JSON, YAML, Markdown |

---

## 🤖 Orchestration Example

Ask Claude or your Agent:

> "Design a secure E-wallet system for fintech. Use TypeScript and deploy to AWS. Run the full SSDLC pipeline."

The agent will call `orchestrate_ssdlc_pipeline` and generate the entire plan for you.
