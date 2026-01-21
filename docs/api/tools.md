# MCP Tools Reference

This document provides a complete reference for all available MCP tools in the SSDLC Security Toolkit.

## Domain Management Tools

### `list_domains`

List all available domain plugins.

**Input**: None

**Output**:
```json
{
  "domains": ["healthcare", "fintech", "blockchain", "secure_comm", ...]
}
```

---

### `load_domain`

Load a specific domain plugin by name.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain_name` | string | Yes | Domain name to load |

**Example**:
```json
{
  "domain_name": "healthcare"
}
```

**Output**: Domain configuration with compliance rules and threats.

---

### `detect_domain`

Auto-detect the appropriate domain from a project description.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_description` | string | Yes | Project description text |

**Example**:
```json
{
  "project_description": "Patient health records management system with HIPAA compliance"
}
```

**Output**: Detected domain configuration.

---

## Analysis Tools

### `ba_analyze_requirements`

Generate user stories, security requirements, and abuse cases from business requirements.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_description` | string | Yes | Project description |
| `business_goals` | string[] | Yes | List of business goals |
| `domain_name` | string | No | Optional domain override |

**Example**:
```json
{
  "project_description": "E-wallet system for mobile payments",
  "business_goals": [
    "Enable peer-to-peer payments",
    "Support multiple currencies",
    "Ensure PCI-DSS compliance"
  ]
}
```

**Output**:
- User stories with acceptance criteria
- Security requirements
- Abuse cases for security testing

---

### `techlead_design`

Generate technical design including features, modules, pseudocode, and architecture diagrams.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_stories` | object[] | No | User stories from BA phase |
| `security_requirements` | string[] | No | Security requirements |
| `target_language` | string | No | Pseudocode language (default: python) |
| `project_name` | string | No | Project name |
| `export_format` | string | No | Output format (json/yaml/markdown) |

**Supported Languages**: `python`, `typescript`, `java`, `go`, `csharp`, `cpp`, `rust`

**Example**:
```json
{
  "user_stories": [
    {
      "id": "US-001",
      "title": "User Registration",
      "as_a": "new user",
      "i_want": "to register an account",
      "so_that": "I can access the platform"
    }
  ],
  "target_language": "typescript",
  "project_name": "MyApp"
}
```

**Output**:
- Feature checklist
- Flow diagrams (Mermaid)
- Module breakdown with classes
- Pseudocode files
- Architecture diagram
- File structure

---

### `security_threat_model`

Generate STRIDE-based threat model from system modules.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modules` | object[] | No | Modules from tech design |
| `domain_name` | string | No | Domain for context |
| `project_name` | string | No | Project name |

**Example**:
```json
{
  "modules": [
    {
      "name": "AuthService",
      "type": "service",
      "responsibilities": ["User authentication", "Token management"]
    }
  ],
  "domain_name": "fintech"
}
```

**Output**:
- STRIDE threat categories
- Risk scores
- Mitigation recommendations
- Domain-specific threats

---

### `qa_design_test_strategy`

Generate comprehensive test strategy from features and threats.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `features` | object[] | No | Features from tech design |
| `threats` | object[] | No | Threats from security analysis |
| `compliance_requirements` | string[] | No | Compliance frameworks |

**Example**:
```json
{
  "features": [
    {
      "id": "F001",
      "name": "User Authentication",
      "priority": "P0"
    }
  ],
  "threats": [
    {
      "id": "T-001",
      "name": "Credential Stuffing",
      "category": "Spoofing"
    }
  ],
  "compliance_requirements": ["GDPR", "PCI-DSS"]
}
```

**Output**:
- Test cases (functional, security, compliance)
- Automation coverage metrics
- Test prioritization

---

### `devops_design_cicd`

Generate CI/CD pipeline with security gates.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Project name |
| `tech_stack` | string[] | No | Technologies used |
| `deployment_target` | string | No | Target platform |
| `repository_platform` | string | No | Git platform |

**Deployment Targets**: `kubernetes`, `aws`, `azure`, `gcp`, `docker`
**Repository Platforms**: `github`, `gitlab`, `bitbucket`

**Example**:
```json
{
  "project_name": "SecureApp",
  "tech_stack": ["Node.js", "PostgreSQL", "Redis"],
  "deployment_target": "kubernetes",
  "repository_platform": "github"
}
```

**Output**:
- Pipeline stages
- Security gates (SAST, DAST, SCA)
- Deployment configuration
- Infrastructure as code hints

---

## Orchestration Tool

### `orchestrate_ssdlc_pipeline`

Run the complete SSDLC pipeline from project description.

**Input**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_description` | string | Yes | Project description |
| `business_goals` | string[] | Yes | Business goals |
| `tech_stack` | string[] | Yes | Technologies |
| `target_language` | string | No | Pseudocode language |
| `deployment_target` | string | No | Deployment platform |
| `compliance_requirements` | string[] | No | Compliance frameworks |

**Example**:
```json
{
  "project_description": "Secure messaging app with end-to-end encryption",
  "business_goals": [
    "Private communications",
    "Multi-device support",
    "GDPR compliance"
  ],
  "tech_stack": ["Rust", "PostgreSQL", "Redis"],
  "target_language": "rust",
  "deployment_target": "kubernetes",
  "compliance_requirements": ["GDPR"]
}
```

**Output**:
- Complete pipeline results
- All phase outputs (BA, Tech Lead, Security, QA, DevOps)
- Summary statistics
- SRS document (optional)

---

## Usage Tips

1. **Start with orchestration**: Use `orchestrate_ssdlc_pipeline` for a complete workflow
2. **Customize with individual tools**: Use specific tools for targeted updates
3. **Leverage domain detection**: Let the toolkit auto-detect the best domain
4. **Iterate on outputs**: Refine results by re-running with adjusted inputs
