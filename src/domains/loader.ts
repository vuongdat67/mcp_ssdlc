import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYAML } from 'yaml';
import type { Domain, Stakeholder, SensitiveData, DataClassification, DomainThreat, Regulation } from '../types/domain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to domains folder
const DOMAINS_PATH = join(__dirname, '../../domains');

export interface LoadedDomain {
    name: string;
    domain: Domain;
    compliance?: {
        regulations: Regulation[];
        auditRequirements?: {
            retentionYears: number;
            mustLog: string[];
        };
    };
    threats?: DomainThreat[];
}

/**
 * Load a specific domain by name
 */
export async function loadDomain(domainName: string): Promise<LoadedDomain> {
    const domainPath = join(DOMAINS_PATH, domainName);

    if (!existsSync(domainPath)) {
        throw new Error(`Domain not found: ${domainName}`);
    }

    // Load domain.yaml (required)
    const domainFile = join(domainPath, 'domain.yaml');
    if (!existsSync(domainFile)) {
        throw new Error(`domain.yaml not found in ${domainName}`);
    }

    const domainYaml = parseYAML(readFileSync(domainFile, 'utf-8'));

    const domain: Domain = {
        name: domainName,
        keywords: domainYaml.keywords || [],
        stakeholders: (domainYaml.stakeholders || []).map((s: any) => ({
            name: s.name,
            type: s.type,
            dataAccess: s.data_access
        })),
        sensitiveData: (domainYaml.sensitive_data || []).map((s: any) => ({
            type: s.type,
            level: s.level,
            encryption: s.encryption
        })),
        dataClassification: domainYaml.data_classification || {
            critical: [],
            high: [],
            medium: [],
            low: []
        }
    };

    const result: LoadedDomain = { name: domainName, domain };

    // Load compliance.yaml (optional)
    const complianceFile = join(domainPath, 'compliance.yaml');
    if (existsSync(complianceFile)) {
        const complianceYaml = parseYAML(readFileSync(complianceFile, 'utf-8'));
        result.compliance = {
            regulations: (complianceYaml.regulations || []).map((r: any) => ({
                name: r.name,
                fullName: r.full_name,
                requirements: (r.requirements || []).map((req: any) => ({
                    id: req.id,
                    name: req.name,
                    description: req.description
                }))
            })),
            auditRequirements: complianceYaml.audit_requirements ? {
                retentionYears: complianceYaml.audit_requirements.retention_years,
                mustLog: complianceYaml.audit_requirements.must_log || []
            } : undefined
        };
    }

    // Load threats.yaml (optional)
    const threatsFile = join(domainPath, 'threats.yaml');
    if (existsSync(threatsFile)) {
        const threatsYaml = parseYAML(readFileSync(threatsFile, 'utf-8'));
        result.threats = (threatsYaml.threats || []).map((t: any) => ({
            id: t.id,
            category: t.category,
            name: t.name,
            description: t.description,
            likelihood: t.likelihood,
            impact: t.impact,
            mitigation: t.mitigation,
            complianceImpact: t.compliance_impact
        }));
    }

    return result;
}

/**
 * List all available domains
 */
export function listDomains(): string[] {
    const domains: string[] = [];
    const entries = readdirSync(DOMAINS_PATH, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('_')) {
            // Check if it has domain.yaml
            const domainFile = join(DOMAINS_PATH, entry.name, 'domain.yaml');
            if (existsSync(domainFile)) {
                domains.push(entry.name);
            }
        }
    }

    return domains;
}

/**
 * Auto-detect domain from project description
 */
export function detectDomain(projectDescription: string): string {
    const description = projectDescription.toLowerCase();
    const availableDomains = listDomains();

    let bestMatch = 'generic';
    let bestScore = 0;

    for (const domainName of availableDomains) {
        if (domainName === 'generic' || domainName === 'custom') continue;

        try {
            const domainFile = join(DOMAINS_PATH, domainName, 'domain.yaml');
            const domainYaml = parseYAML(readFileSync(domainFile, 'utf-8'));
            const keywords: string[] = domainYaml.keywords || [];

            // Count keyword matches
            let score = 0;
            for (const keyword of keywords) {
                if (description.includes(keyword.toLowerCase())) {
                    score++;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = domainName;
            }
        } catch {
            // Skip invalid domains
        }
    }

    return bestMatch;
}

/**
 * Load domain with auto-detection
 */
export async function loadDomainAuto(projectDescription: string): Promise<LoadedDomain> {
    const detectedDomain = detectDomain(projectDescription);
    return loadDomain(detectedDomain);
}
