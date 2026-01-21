# Domain System Overview

The domain system is the core of the MCP SSDLC Security Toolkit's intelligence. It provides industry-specific context, compliance requirements, and threat knowledge.

## What is a Domain?

A **domain** is a plugin that provides:
- Industry-specific terminology and stakeholders
- Compliance framework requirements
- Common threats and vulnerabilities
- Data classification guidelines
- Security best practices

## Built-in Domains

| Domain | Industry | Compliance | Use Case |
|--------|----------|------------|----------|
| `healthcare` | Healthcare/Medical | HIPAA | Patient records, telemedicine |
| `fintech` | Financial Services | PCI-DSS | Payments, banking, trading |
| `blockchain` | DLT/Crypto | N/A | Smart contracts, DeFi |
| `secure_comm` | Communications | GDPR | E2EE messaging, VoIP |
| `appsec` | Security | OWASP | Security tooling |
| `networksec` | Security | N/A | Network monitoring |
| `websec` | Security | OWASP | WAF, web protection |
| `ml_ai` | Machine Learning | N/A | Model security, AI systems |
| `malware_analysis` | Security Research | N/A | Malware analysis platforms |
| `reverse_engineering` | Security Research | N/A | RE tools |
| `devops` | Operations | N/A | DevOps automation |
| `devsecops` | Security | N/A | Security in CI/CD |
| `soc` | Security | N/A | SOC platforms |
| `generic` | Any | N/A | General applications |

## Domain Structure

Each domain is defined by YAML files:

```
domains/<domain-name>/
├── domain.yaml      # Required: Core definition
├── compliance.yaml  # Optional: Compliance requirements
└── threats.yaml     # Optional: Domain-specific threats
```

### domain.yaml

```yaml
name: "healthcare"
keywords:
  - "patient"
  - "medical"
  - "health"
  - "HIPAA"
  - "PHI"
  - "clinical"

stakeholders:
  - name: "Patient"
    type: "end_user"
  - name: "Healthcare Provider"
    type: "admin"
  - name: "Compliance Officer"
    type: "auditor"

sensitiveData:
  - type: "PHI"
    level: "critical"
  - type: "Medical Records"
    level: "critical"
  - type: "Insurance Info"
    level: "high"

dataClassification:
  critical:
    - "phi"
    - "medical_records"
  high:
    - "insurance_data"
    - "billing_info"
  medium:
    - "appointment_history"
  low:
    - "facility_info"
```

### compliance.yaml

```yaml
regulations:
  - name: "HIPAA"
    fullName: "Health Insurance Portability and Accountability Act"
    requirements:
      - id: "HIPAA-164.312(a)"
        name: "Access Control"
        description: "Implement technical policies to limit access to PHI"
      - id: "HIPAA-164.312(b)"
        name: "Audit Controls"
        description: "Implement hardware/software for audit logs"
      - id: "HIPAA-164.312(c)"
        name: "Integrity"
        description: "Protect PHI from improper alteration"
      - id: "HIPAA-164.312(d)"
        name: "Authentication"
        description: "Verify person/entity seeking access"
      - id: "HIPAA-164.312(e)"
        name: "Transmission Security"
        description: "Guard against unauthorized access during transmission"
```

### threats.yaml

```yaml
threats:
  - name: "PHI Data Breach"
    category: "Information Disclosure"
    likelihood: "high"
    impact: "critical"
    mitigation:
      - "Encrypt PHI at rest and in transit"
      - "Implement access logging"
      - "Regular security audits"
  
  - name: "Unauthorized Access to Medical Records"
    category: "Elevation of Privilege"
    likelihood: "medium"
    impact: "critical"
    mitigation:
      - "Role-based access control"
      - "Multi-factor authentication"
      - "Audit trails"
```

## Domain Detection

The toolkit can auto-detect domains from project descriptions:

```typescript
// Internal logic
const keywords = {
  healthcare: ["patient", "medical", "health", "hipaa", "phi"],
  fintech: ["payment", "bank", "finance", "pci", "transaction"],
  blockchain: ["blockchain", "smart contract", "defi", "crypto"],
  // ...
};
```

When you provide a description like:
> "Patient health records management system"

The toolkit matches keywords and selects `healthcare`.

## Using Domains

### Automatic Detection

```
"Design a secure payment processing system"
→ Automatically detects: fintech
```

### Explicit Selection

```json
{
  "domain_name": "healthcare",
  "project_description": "Custom medical application"
}
```

## Creating Custom Domains

See [Creating Custom Domains](./creating-domains.md) for detailed instructions.

## Domain Impact

Domains affect:

1. **User Stories**: Stakeholder-specific stories
2. **Security Requirements**: Compliance-driven requirements
3. **Threat Model**: Domain-specific threats
4. **Test Cases**: Compliance test cases
5. **ADRs**: Domain-aware architecture decisions
6. **Pseudocode**: Domain-specific patterns (e.g., Signal Protocol for secure_comm)
