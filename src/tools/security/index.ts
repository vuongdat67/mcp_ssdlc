// Security Engineer Tool - Module-connected threat modeling
import type { Threat, SecurityOutput, RiskMatrixItem } from '../../types/tools.js';
import type { Module } from '../../types/tech-lead.js';
import type { LoadedDomain } from '../../domains/loader.js';

export interface SecurityInput {
    modules: Module[];
    domain?: LoadedDomain;
    projectName?: string;
}

/**
 * Generate STRIDE threat model connected to modules
 */
export function generateThreatModel(input: SecurityInput): SecurityOutput {
    const { modules, domain } = input;

    const threats = generateThreats(modules, domain);
    const riskMatrix = generateRiskMatrix(threats);
    const recommendations = generateRecommendations(threats, domain);

    return { threats, riskMatrix, recommendations };
}

function generateThreats(modules: Module[], domain?: LoadedDomain): Threat[] {
    const threats: Threat[] = [];
    let id = 1;

    for (const module of modules) {
        const moduleThreats = analyzeModuleThreats(module, id);
        threats.push(...moduleThreats);
        id += moduleThreats.length;
    }

    // Add domain-specific threats - convert to lowercase
    if (domain?.threats) {
        for (const domainThreat of domain.threats) {
            threats.push({
                id: `T-${String(id).padStart(3, '0')}`,
                category: domainThreat.category as Threat['category'],
                name: domainThreat.name,
                description: domainThreat.description,
                targetComponent: 'System',
                likelihood: domainThreat.likelihood as Threat['likelihood'],
                impact: domainThreat.impact as Threat['impact'],
                riskScore: calculateRisk(domainThreat.likelihood, domainThreat.impact),
                cwe: getCWE(domainThreat.category),
                owasp: getOWASP(domainThreat.category),
                mitigation: [domainThreat.mitigation]
            });
            id++;
        }
    }

    return threats;
}

function analyzeModuleThreats(module: Module, startId: number): Threat[] {
    const threats: Threat[] = [];
    const moduleName = module.name;
    let id = startId;

    const isAuth = moduleName.toLowerCase().includes('auth') || moduleName.toLowerCase().includes('security');
    const isData = moduleName.toLowerCase().includes('data') || moduleName.toLowerCase().includes('repository');
    const isController = moduleName.toLowerCase().includes('controller');

    if (isAuth || isController) {
        threats.push({
            id: `T-${String(id).padStart(3, '0')}`,
            category: 'Spoofing',
            name: `Identity Spoofing on ${moduleName}`,
            description: `Attacker impersonates legitimate user to access ${moduleName}`,
            targetComponent: moduleName,
            likelihood: 'high',
            impact: 'critical',
            riskScore: 9.0,
            cwe: 'CWE-287',
            owasp: 'A07:2021',
            mitigation: ['Implement multi-factor authentication', 'Use secure session management', 'Monitor for suspicious login patterns']
        });
        id++;
    }

    if (isData) {
        threats.push({
            id: `T-${String(id).padStart(3, '0')}`,
            category: 'Tampering',
            name: `Data Tampering in ${moduleName}`,
            description: `Unauthorized modification of data in ${moduleName}`,
            targetComponent: moduleName,
            likelihood: 'medium',
            impact: 'high',
            riskScore: 7.0,
            cwe: 'CWE-284',
            owasp: 'A01:2021',
            mitigation: ['Implement integrity checks (HMAC)', 'Enable audit logging', 'Use role-based access control']
        });
        id++;
    }

    threats.push({
        id: `T-${String(id).padStart(3, '0')}`,
        category: 'Information Disclosure',
        name: `Data Leakage from ${moduleName}`,
        description: `Sensitive information exposed from ${moduleName}`,
        targetComponent: moduleName,
        likelihood: 'medium',
        impact: isData ? 'critical' : 'high',
        riskScore: isData ? 8.0 : 6.5,
        cwe: 'CWE-200',
        owasp: 'A01:2021',
        mitigation: ['Encrypt sensitive data at rest', 'Use TLS for data in transit', 'Implement data masking in logs']
    });
    id++;

    if (isController) {
        threats.push({
            id: `T-${String(id).padStart(3, '0')}`,
            category: 'Denial of Service',
            name: `DoS Attack on ${moduleName}`,
            description: `Resource exhaustion attack targeting ${moduleName}`,
            targetComponent: moduleName,
            likelihood: 'medium',
            impact: 'medium',
            riskScore: 5.5,
            cwe: 'CWE-770',
            owasp: 'A04:2021',
            mitigation: ['Implement rate limiting', 'Use resource quotas', 'Enable auto-scaling']
        });
        id++;
    }

    if (isAuth) {
        threats.push({
            id: `T-${String(id).padStart(3, '0')}`,
            category: 'Elevation of Privilege',
            name: `Privilege Escalation via ${moduleName}`,
            description: `Attacker gains unauthorized elevated access through ${moduleName}`,
            targetComponent: moduleName,
            likelihood: 'medium',
            impact: 'critical',
            riskScore: 8.5,
            cwe: 'CWE-269',
            owasp: 'A01:2021',
            mitigation: ['Implement strict RBAC', 'Apply principle of least privilege', 'Regular permission audits']
        });
        id++;
    }

    return threats;
}

function generateRiskMatrix(threats: Threat[]): RiskMatrixItem[] {
    return threats.map(threat => ({
        threatId: threat.id,
        likelihood: threat.likelihood,
        impact: threat.impact,
        risk: categorizeRisk(threat.riskScore)
    }));
}

function generateRecommendations(threats: Threat[], domain?: LoadedDomain): string[] {
    const recommendations: string[] = [];
    const criticalThreats = threats.filter(t => t.impact === 'critical').length;
    const highThreats = threats.filter(t => t.impact === 'high').length;

    recommendations.push(`🔴 ${criticalThreats} critical threats require immediate attention`);
    recommendations.push(`🟠 ${highThreats} high-priority threats need mitigation planning`);
    recommendations.push('🛡️ Implement defense-in-depth: multiple layers of security');
    recommendations.push('📊 Use this threat model as input for security testing');

    if (domain?.compliance?.regulations) {
        for (const reg of domain.compliance.regulations) {
            recommendations.push(`✅ Ensure ${reg.name} compliance controls are implemented`);
        }
    }

    return recommendations;
}

function calculateRisk(likelihood: string, impact: string): number {
    const likelihoodScore: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const impactScore: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return (likelihoodScore[likelihood] || 2) * (impactScore[impact] || 2) * 1.1;
}

function categorizeRisk(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
}

function getCWE(category: string): string {
    const cweMap: Record<string, string> = {
        'Spoofing': 'CWE-287',
        'Tampering': 'CWE-284',
        'Repudiation': 'CWE-778',
        'Information Disclosure': 'CWE-200',
        'Denial of Service': 'CWE-770',
        'Elevation of Privilege': 'CWE-269'
    };
    return cweMap[category] || 'CWE-1000';
}

function getOWASP(category: string): string {
    const owaspMap: Record<string, string> = {
        'Spoofing': 'A07:2021',
        'Tampering': 'A01:2021',
        'Information Disclosure': 'A01:2021',
        'Denial of Service': 'A04:2021',
        'Elevation of Privilege': 'A01:2021'
    };
    return owaspMap[category] || 'A00:2021';
}
