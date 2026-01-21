# Creating Custom Domains

This guide explains how to create custom domain plugins for the MCP SSDLC Security Toolkit.

## Quick Start

1. Create a folder: `domains/custom/<your-domain>/`
2. Add `domain.yaml` with your domain definition
3. Optionally add `compliance.yaml` and `threats.yaml`
4. Restart the MCP server

## Step-by-Step Guide

### Step 1: Create Domain Folder

```bash
mkdir -p domains/custom/ecommerce
```

### Step 2: Create domain.yaml

This is the **required** file for any domain:

```yaml
# domains/custom/ecommerce/domain.yaml

name: "ecommerce"

# Keywords for auto-detection
keywords:
  - "shop"
  - "cart"
  - "checkout"
  - "order"
  - "product"
  - "inventory"
  - "customer"
  - "retail"

# Stakeholders in your domain
stakeholders:
  - name: "Shopper"
    type: "end_user"
    description: "End customer making purchases"
  - name: "Merchant"
    type: "admin"
    description: "Store owner/administrator"
  - name: "Support Agent"
    type: "support"
    description: "Customer service representative"

# Sensitive data types in your domain
sensitiveData:
  - type: "Payment Card Data"
    level: "critical"
    description: "Credit/debit card information"
  - type: "Customer PII"
    level: "high"
    description: "Name, email, phone, address"
  - type: "Order History"
    level: "medium"
    description: "Purchase history and preferences"
  - type: "Product Catalog"
    level: "low"
    description: "Public product information"

# Data classification for security controls
dataClassification:
  critical:
    - "payment_data"
    - "card_numbers"
  high:
    - "customer_pii"
    - "addresses"
  medium:
    - "order_history"
    - "preferences"
  low:
    - "product_catalog"
    - "reviews"

# Optional: Domain-specific requirements
domain_specific_requirements:
  - id: "ECOM-001"
    name: "Cart Security"
    description: "Protect shopping cart from manipulation"
  - id: "ECOM-002"
    name: "Price Integrity"
    description: "Prevent price tampering attacks"

# Optional: Technical constraints
technical_constraints:
  performance:
    - "Sub-200ms checkout response time"
    - "99.99% uptime during sales events"
  scalability:
    - "Handle 10x traffic during flash sales"
  
# Optional: Recommended tech stack
recommended_tech_stack:
  languages:
    - "TypeScript"
    - "Python"
  databases:
    - "PostgreSQL"
    - "Redis"
  infrastructure:
    - "Kubernetes"
    - "AWS"
```

### Step 3: Create compliance.yaml (Optional)

Add compliance requirements if applicable:

```yaml
# domains/custom/ecommerce/compliance.yaml

regulations:
  - name: "PCI-DSS"
    fullName: "Payment Card Industry Data Security Standard"
    requirements:
      - id: "PCI-1.1"
        name: "Firewall Configuration"
        description: "Install and maintain a firewall configuration"
      - id: "PCI-3.4"
        name: "Card Data Protection"
        description: "Render PAN unreadable anywhere it is stored"
      - id: "PCI-6.5"
        name: "Secure Development"
        description: "Address common coding vulnerabilities"
      - id: "PCI-8.3"
        name: "Strong Authentication"
        description: "Secure authentication for access"
      - id: "PCI-10.1"
        name: "Audit Trails"
        description: "Track and monitor all access to resources"

  - name: "GDPR"
    fullName: "General Data Protection Regulation"
    requirements:
      - id: "GDPR-Art6"
        name: "Lawful Processing"
        description: "Lawful basis for processing personal data"
      - id: "GDPR-Art17"
        name: "Right to Erasure"
        description: "Support data deletion requests"
      - id: "GDPR-Art32"
        name: "Security of Processing"
        description: "Implement appropriate security measures"
```

### Step 4: Create threats.yaml (Optional)

Add domain-specific threats:

```yaml
# domains/custom/ecommerce/threats.yaml

threats:
  - name: "Credit Card Skimming"
    category: "Information Disclosure"
    likelihood: "high"
    impact: "critical"
    description: "Malicious scripts capturing payment data"
    mitigation:
      - "Implement Content Security Policy"
      - "Use PCI-compliant payment processor"
      - "Regular security scanning"

  - name: "Price Manipulation"
    category: "Tampering"
    likelihood: "medium"
    impact: "high"
    description: "Attacker modifying prices in cart/checkout"
    mitigation:
      - "Server-side price validation"
      - "Signed cart tokens"
      - "Audit logging for price changes"

  - name: "Inventory Fraud"
    category: "Denial of Service"
    likelihood: "medium"
    impact: "medium"
    description: "Bot attacks hoarding inventory"
    mitigation:
      - "Rate limiting"
      - "Bot detection"
      - "Cart expiration"

  - name: "Account Takeover"
    category: "Spoofing"
    likelihood: "high"
    impact: "high"
    description: "Credential stuffing attacks"
    mitigation:
      - "Multi-factor authentication"
      - "Credential monitoring"
      - "Anomaly detection"
```

### Step 5: Restart and Test

```bash
# Restart MCP server
pnpm build
pnpm start

# Or in Claude/VS Code, restart the MCP client
```

Test your domain:
```
"List available domains"
→ Should include "ecommerce"

"Design an online shopping platform for retail"
→ Should auto-detect "ecommerce" domain
```

## Best Practices

1. **Use descriptive keywords**: Add common terms used in your industry
2. **Include all stakeholder types**: End users, admins, auditors, etc.
3. **Be specific with data classification**: This affects security controls
4. **Add relevant compliance**: Only include frameworks that apply
5. **Document domain-specific threats**: Helps generate better threat models

## Validation

Your domain YAML must be valid. Check with:

```bash
node -e "import('yaml').then(y => console.log(y.parse(require('fs').readFileSync('domains/custom/ecommerce/domain.yaml', 'utf8'))))"
```

## Advanced: Extended Schema

For advanced use cases, you can add:

```yaml
# Additional fields supported by the loader

# Data flow definitions
data_flows:
  - name: "Checkout Flow"
    from: "Customer"
    to: "Payment Processor"
    data: ["card_data", "order_details"]
    security: "TLS 1.3"

# Integration points
integrations:
  - name: "Payment Gateway"
    type: "external"
    protocol: "REST API"
  - name: "Shipping Provider"
    type: "external"
    protocol: "Webhook"
```
