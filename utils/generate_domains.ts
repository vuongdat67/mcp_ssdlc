
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Helper to write YAML content (simple string template to avoid dep issues in script)
function toYaml(obj: any, indent = 0): string {
    const spacing = '  '.repeat(indent);
    let yaml = '';

    for (const key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
            yaml += `${spacing}${key}:\n`;
            value.forEach(item => {
                if (typeof item === 'object') {
                    yaml += `${spacing}  -\n${toYaml(item, indent + 2).replace(/^  /, '')}`; // rough hack but works for simple structures
                } else {
                    yaml += `${spacing}  - "${item}"\n`;
                }
            });
        } else if (typeof value === 'object' && value !== null) {
            yaml += `${spacing}${key}:\n${toYaml(value, indent + 1)}`;
        } else {
            yaml += `${spacing}${key}: "${value}"\n`;
        }
    }
    return yaml;
}

// Since toYaml above is a bit brittle with my manual string manip, let's just use JSON for the intermediate or use a library if available. 
// Actually, I'll just write string templates for the files to ensure valid YAML without fighting a custom serializer.

const BASE_DIR = join(process.cwd(), 'domains');

const DOMAINS = [
    {
        id: 'appsec',
        name: 'Application Security',
        keywords: ['appsec', 'sast', 'dast', 'penetration testing', 'secure coding', 'code review', 'vulnerability management'],
        knowledge_base: ['OWASP Top 10', 'CWE Top 25', 'ASVS'],
        stakeholders: [
            { name: 'Security Engineer', type: 'professional', dataAccess: 'full' },
            { name: 'Developer', type: 'internal', dataAccess: 'code' }
        ],
        standards: ['OWASP ASVS', 'NIST SP 800-53'],
        threats: [
            { id: 'appsec-001', category: 'Injection', name: 'SQL/Command Injection', risk: 'critical', mitigation: 'Input validation, parameterized queries' },
            { id: 'appsec-002', category: 'Broken Auth', name: 'Weak Authentication', risk: 'high', mitigation: 'MFA, strong password policies' }
        ]
    },
    {
        id: 'devops',
        name: 'DevOps & Infrastructure',
        keywords: ['devops', 'ci/cd', 'docker', 'kubernetes', 'terraform', 'ansible', 'infrastructure as code', 'iac'],
        knowledge_base: ['The DevOps Handbook', 'SRE Workbook'],
        stakeholders: [
            { name: 'DevOps Engineer', type: 'professional', dataAccess: 'infrastructure' },
            { name: 'SRE', type: 'professional', dataAccess: 'infrastructure' }
        ],
        standards: ['CIS Benchmarks', 'NIST SP 800-190 (Containers)'],
        threats: [
            { id: 'devops-001', category: 'Misconfiguration', name: 'Insecure Container Defaults', risk: 'high', mitigation: 'Hardened images, non-root users' },
            { id: 'devops-002', category: 'Information Disclosure', name: 'Secrets in Code/Logs', risk: 'critical', mitigation: 'Secret management (Vault), git-secrets' }
        ]
    },
    {
        id: 'devsecops',
        name: 'DevSecOps',
        keywords: ['devsecops', 'security pipeline', 'shift left', 'automated security', 'dependency check', 'trivy', 'snyk'],
        knowledge_base: ['DevSecOps Manifesto', 'DoD DevSecOps Reference Design'],
        stakeholders: [
            { name: 'DevSecOps Lead', type: 'professional', dataAccess: 'all' }
        ],
        standards: ['OpenSSF Compliance', 'SLSA'],
        threats: [
            { id: 'dso-001', category: 'Tampering', name: 'Pipeline Poisoning', risk: 'critical', mitigation: 'Pipeline integrity checks, signed commits' },
            { id: 'dso-002', category: 'Dependency', name: 'Supply Chain Attack', risk: 'high', mitigation: 'SBOM, dependency pinning, private registry' }
        ]
    },
    {
        id: 'blockchain',
        name: 'Blockchain & Smart Contracts',
        keywords: ['blockchain', 'smart contract', 'solidity', 'ethereum', 'web3', 'defi', 'crypto', 'consensus', 'distributed ledger'],
        knowledge_base: ['Ethereum Yellow Paper', 'Mastering Bitcoin'],
        stakeholders: [
            { name: 'Smart Contract Dev', type: 'internal', dataAccess: 'contracts' },
            { name: 'Auditor', type: 'external', dataAccess: 'contracts' }
        ],
        standards: ['SWC Registry', 'Smart Contract Security Verification Standard (SCSVS)'],
        threats: [
            { id: 'blk-001', category: 'Logic', name: 'Reentrancy Attack', risk: 'critical', mitigation: 'Checks-Effects-Interactions pattern, ReentrancyGuard' },
            { id: 'blk-002', category: 'Spoofing', name: 'Front Running', risk: 'medium', mitigation: 'Commit-reveal schemes, gas limit management' }
        ]
    },
    {
        id: 'ml_ai',
        name: 'AI/ML & Data Science',
        keywords: ['machine learning', 'artificial intelligence', 'deep learning', 'federated learning', 'cfg', 'dfg', 'model training', 'adversarial'],
        knowledge_base: ['NIST AI RMF', 'Adversarial ML Threat Matrix'],
        stakeholders: [
            { name: 'Data Scientist', type: 'internal', dataAccess: 'datasets' },
            { name: 'ML Engineer', type: 'internal', dataAccess: 'models' }
        ],
        standards: ['OWASP AI Security Top 10', 'ISO/IEC 42001'],
        threats: [
            { id: 'ai-001', category: 'Tampering', name: 'Data Poisoning', risk: 'high', mitigation: 'Data sanitization, anomaly detection, robust statistics' },
            { id: 'ai-002', category: 'Information Disclosure', name: 'Model Inversion', risk: 'medium', mitigation: 'Differential privacy, output limiting' },
            { id: 'ai-003', category: 'Tampering', name: 'Adversarial Example', risk: 'high', mitigation: 'Adversarial training, input transformation' }
        ]
    },
    {
        id: 'networksec',
        name: 'Network Security (IDS/IPS)',
        keywords: ['network security', 'ids', 'ips', 'firewall', 'pcap', 'packet analysis', 'deep packet inspection', 'dpi', 'network forensics'],
        knowledge_base: ['TCP/IP Illustrated', 'Snort Manual'],
        stakeholders: [
            { name: 'Network Admin', type: 'internal', dataAccess: 'traffic_logs' },
            { name: 'Security Analyst', type: 'professional', dataAccess: 'alerts' }
        ],
        standards: ['PCI-DSS (Network)', 'NIST SP 800-41'],
        threats: [
            { id: 'net-001', category: 'Denial of Service', name: 'DDoS / Volumetric Attack', risk: 'high', mitigation: 'Rate limiting, traffic scrubbing, CDN' },
            { id: 'net-002', category: 'Spoofing', name: 'IP/MAC Spoofing', risk: 'medium', mitigation: 'Port security, ingress filtering' },
            { id: 'net-003', category: 'Tampering', name: 'Man-in-the-Middle', risk: 'high', mitigation: 'TLS everywhere, mutual auth, VP' }
        ]
    },
    {
        id: 'reverse_engineering',
        name: 'Reverse Engineering',
        keywords: ['reverse engineering', 'ghidra', 'ida pro', 'disassembly', 'decompilation', 'binary analysis', 'analyzing malware', 'firmware analysis'],
        knowledge_base: ['Practical Reverse Engineering', 'Reversing: Secrets of Reverse Engineering'],
        stakeholders: [
            { name: 'Reverse Engineer', type: 'professional', dataAccess: 'binaries' }
        ],
        standards: ['Legal guidelines on RE', 'DMCA exemptions'],
        threats: [
            { id: 're-001', category: 'Obfuscation', name: 'Anti-Disassembly/Anti-Debugging', risk: 'high', mitigation: 'Dynamic binary instrumentation, de-obfuscation tools' },
            { id: 're-002', category: 'Logic', name: 'Logic Bomb / Time Bomb', risk: 'critical', mitigation: 'Comprehensive code coverage analysis, sandbox execution' }
        ]
    },
    {
        id: 'malware_analysis',
        name: 'Malware Analysis',
        keywords: ['malware analysis', 'sandbox', 'ransomware', 'virus', 'trojan', 'c2', 'indicators of compromise', 'ioc', 'behavioral analysis'],
        knowledge_base: ['Practical Malware Analysis', 'MITRE ATT&CK'],
        stakeholders: [
            { name: 'Malware Analyst', type: 'professional', dataAccess: 'samples' },
            { name: 'Incident Responder', type: 'professional', dataAccess: 'reports' }
        ],
        standards: ['MAEC (Malware Attribute Enumeration and Characterization)'],
        threats: [
            { id: 'mal-001', category: 'Evasion', name: 'Sandbox Evasion', risk: 'critical', mitigation: 'Bare-metal analysis, stall-code detection, user interaction simulation' },
            { id: 'mal-002', category: 'Tampering', name: 'Rootkit/Kernel Hooking', risk: 'high', mitigation: 'Kernel-level monitoring, memory integrity checks' }
        ]
    },
    {
        id: 'websec',
        name: 'Web Security',
        keywords: ['web security', 'webapp', 'xss', 'csrf', 'sqli', 'owasp', 'csp', 'cors', 'hsts', 'content security policy'],
        knowledge_base: ['OWASP Testing Guide', 'Web Application Hacker\'s Handbook'],
        stakeholders: [
            { name: 'Web Developer', type: 'internal', dataAccess: 'code' },
            { name: 'Penetration Tester', type: 'external', dataAccess: 'application' }
        ],
        standards: ['OWASP Top 10', 'WASC Threat Classification'],
        threats: [
            { id: 'web-001', category: 'Injection', name: 'Cross-Site Scripting (XSS)', risk: 'high', mitigation: 'Context-aware encoding, CSP, HttpOnly cookies' },
            { id: 'web-002', category: 'Broken Auth', name: 'Session Hijacking', risk: 'high', mitigation: 'Secure cookie attributes, session timeouts, rotation' }
        ]
    },
    {
        id: 'soc',
        name: 'Security Operations (SOC)',
        keywords: ['soc', 'siem', 'soar', 'incident response', 'log analysis', 'splunk', 'elastic', 'threat hunting', 'endpoint detection', 'edr'],
        knowledge_base: ['Blue Team Handbook', 'NIST Incident Response Cycle'],
        stakeholders: [
            { name: 'SOC Analyst', type: 'professional', dataAccess: 'logs' },
            { name: 'SOC Manager', type: 'internal', dataAccess: 'reports' }
        ],
        standards: ['NIST SP 800-61', 'ISO 27035'],
        threats: [
            { id: 'soc-001', category: 'Info Disclosure', name: 'Log Injection / Tampering', risk: 'high', mitigation: 'Immutable logs, signed logs, centralized logging' },
            { id: 'soc-002', category: 'DoS', name: 'Alert Fatigue / Flooding', risk: 'medium', mitigation: 'Correlation rules, AI-driven triage, tuning' }
        ]
    }
];

function generate() {
    console.log('🚀 Generating domains...');

    for (const d of DOMAINS) {
        const domainDir = join(BASE_DIR, d.id);
        if (!existsSync(domainDir)) {
            mkdirSync(domainDir, { recursive: true });
        }

        // 1. domain.yaml
        let domainYaml = `name: "${d.name}"\n`;
        domainYaml += `description: "Security resources and guidance for ${d.name}"\n`;
        domainYaml += `keywords:\n`;
        d.keywords.forEach(k => domainYaml += `  - "${k}"\n`);

        domainYaml += `knowledge_base:\n`;
        d.knowledge_base.forEach(kb => domainYaml += `  - "${kb}"\n`);

        domainYaml += `architecture_patterns:\n  - "Secure by Design"\n  - "Defense in Depth"\n`;

        domainYaml += `security_standards:\n`;
        d.standards.forEach(s => domainYaml += `  - "${s}"\n`);

        domainYaml += `stakeholders:\n`;
        d.stakeholders.forEach(s => {
            domainYaml += `  - name: "${s.name}"\n    type: "${s.type}"\n    dataAccess: "${s.dataAccess}"\n`;
        });

        domainYaml += `sensitiveData:\n`;
        domainYaml += `  - type: "Credentials"\n    level: "critical"\n    encryption: "required"\n`;

        domainYaml += `dataClassification:\n`;
        domainYaml += `  critical:\n    - "Secrets"\n    - "PII"\n  high:\n    - "Configuration"\n  medium:\n    - "Internal Docs"\n  low:\n    - "Public Data"\n`;

        writeFileSync(join(domainDir, 'domain.yaml'), domainYaml);

        // 2. threats.yaml
        let threatsYaml = `threats:\n`;
        d.threats.forEach(t => {
            threatsYaml += `  - id: "${t.id}"\n`;
            threatsYaml += `    category: "${t.category}"\n`; // Note: Might need mapping to strictly valid schema enum if strict
            threatsYaml += `    name: "${t.name}"\n`;
            threatsYaml += `    description: "Specific threat for ${d.name}"\n`;
            threatsYaml += `    likelihood: "high"\n`;
            threatsYaml += `    impact: "${t.risk}"\n`;
            threatsYaml += `    mitigation: "${t.mitigation}"\n`;
        });
        writeFileSync(join(domainDir, 'threats.yaml'), threatsYaml);

        // 3. compliance.yaml
        let complianceYaml = `regulations:\n`;
        d.standards.forEach((s, idx) => {
            complianceYaml += `  - name: "${s.split(' ')[0]}"\n`;
            complianceYaml += `    fullName: "${s}"\n`;
            complianceYaml += `    requirements:\n`;
            complianceYaml += `      - id: "REQ-${idx + 1}"\n        name: "Compliance Rule"\n        description: "Must adhere to ${s}"\n`;
        });
        writeFileSync(join(domainDir, 'compliance.yaml'), complianceYaml);

        console.log(`✅ Generated: ${d.name} (${d.id})`);
    }
}

generate();
