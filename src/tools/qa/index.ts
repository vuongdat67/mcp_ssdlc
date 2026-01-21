// QA Engineer Tool - Feature + Threat connected testing
import type { TestCase, QAOutput, PenTestPhase, AutomationCoverage, Threat } from '../../types/tools.js';
import type { Feature } from '../../types/tech-lead.js';

export interface QAInput {
    features: Feature[];
    threats: Threat[];
    complianceRequirements?: string[];
}

/**
 * Generate test strategy from features and threats
 */
export function designTestStrategy(input: QAInput): QAOutput {
    const { features, threats, complianceRequirements = [] } = input;

    const testCases = generateTestCases(features, threats, complianceRequirements);
    const penetrationTestPlan = generatePenTestPlan(threats);
    const automationCoverage = calculateCoverage(testCases);

    return { testCases, penetrationTestPlan, automationCoverage };
}

function generateTestCases(
    features: Feature[],
    threats: Threat[],
    compliance: string[]
): TestCase[] {
    const testCases: TestCase[] = [];
    let id = 1;

    // Feature-based test cases
    for (const feature of features) {
        testCases.push({
            id: `TC-${String(id).padStart(3, '0')}`,
            category: 'Functional',
            title: `Verify ${feature.name} functionality`,
            relatedTo: feature.id,
            priority: featurePriorityToTestPriority(feature.priority),
            testSteps: [
                `Navigate to ${feature.name} feature`,
                'Verify all UI elements are present',
                'Test happy path scenario',
                'Verify expected outcome'
            ],
            expectedResult: `${feature.name} works as specified`,
            automated: true,
            toolsRequired: ['Selenium', 'Jest']
        });
        id++;
    }

    // Threat-based security test cases
    for (const threat of threats) {
        testCases.push({
            id: `TC-${String(id).padStart(3, '0')}`,
            category: getTestCategory(threat.category),
            title: `Verify protection against ${threat.name}`,
            relatedTo: threat.id,
            priority: threatImpactToTestPriority(threat.impact),
            testSteps: getSecurityTestSteps(threat),
            expectedResult: `System is protected against ${threat.category}`,
            automated: canAutomate(threat),
            toolsRequired: getSecurityTools(threat)
        });
        id++;
    }

    // Compliance test cases
    for (const req of compliance) {
        testCases.push({
            id: `TC-${String(id).padStart(3, '0')}`,
            category: 'Compliance',
            title: `Verify ${req} compliance`,
            relatedTo: req,
            priority: 'critical',
            testSteps: [`Review ${req} requirements`, 'Map requirements to controls', 'Verify controls are implemented', 'Document evidence'],
            expectedResult: `${req} requirements are met`,
            automated: false,
            toolsRequired: ['Manual audit', 'Compliance checklist']
        });
        id++;
    }

    return testCases;
}

function generatePenTestPlan(threats: Threat[]): PenTestPhase[] {
    return [
        {
            phase: 'Reconnaissance',
            duration: '2 days',
            activities: ['OSINT gathering', 'Network enumeration', 'Technology stack identification', 'Attack surface mapping']
        },
        {
            phase: 'Scanning & Vulnerability Assessment',
            duration: '3 days',
            activities: ['Port scanning (Nmap)', 'Vulnerability scanning (Nessus)', 'Web application scanning (OWASP ZAP)', 'API endpoint discovery']
        },
        {
            phase: 'Exploitation',
            duration: '5 days',
            activities: [
                'OWASP Top 10 testing',
                'Authentication bypass attempts',
                'Privilege escalation testing',
                'Business logic testing',
                ...threats.slice(0, 3).map(t => `Test for ${t.category}: ${t.name}`)
            ]
        },
        {
            phase: 'Post-Exploitation',
            duration: '2 days',
            activities: ['Lateral movement assessment', 'Data exfiltration simulation', 'Persistence testing', 'Clean-up verification']
        },
        {
            phase: 'Reporting',
            duration: '2 days',
            activities: ['Finding documentation', 'Risk assessment', 'Remediation recommendations', 'Executive summary']
        }
    ];
}

function calculateCoverage(testCases: TestCase[]): AutomationCoverage {
    const total = testCases.length;
    const automated = testCases.filter(tc => tc.automated).length;
    return {
        totalTests: total,
        automated,
        manual: total - automated,
        percentage: Math.round((automated / total) * 100)
    };
}

function featurePriorityToTestPriority(priority: string): TestCase['priority'] {
    switch (priority) {
        case 'P0': return 'critical';
        case 'P1': return 'high';
        case 'P2': return 'medium';
        default: return 'low';
    }
}

function threatImpactToTestPriority(impact: string): TestCase['priority'] {
    switch (impact) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        default: return 'low';
    }
}

function getTestCategory(threatCategory: string): string {
    switch (threatCategory) {
        case 'Spoofing': return 'Authentication';
        case 'Tampering': return 'Authorization';
        case 'Information Disclosure': return 'Cryptography';
        case 'Denial of Service': return 'Availability';
        case 'Elevation of Privilege': return 'Authorization';
        default: return 'Security';
    }
}

function getSecurityTestSteps(threat: Threat): string[] {
    switch (threat.category) {
        case 'Spoofing':
            return ['Attempt authentication bypass', 'Test for weak credentials', 'Verify MFA enforcement', 'Check session management'];
        case 'Tampering':
            return ['Attempt unauthorized data modification', 'Test integrity checks', 'Verify RBAC enforcement', 'Check audit logging'];
        case 'Information Disclosure':
            return ['Test for data leakage', 'Verify encryption at rest', 'Check TLS configuration', 'Review error messages'];
        case 'Denial of Service':
            return ['Load testing', 'Verify rate limiting', 'Test resource quotas', 'Check auto-scaling'];
        case 'Elevation of Privilege':
            return ['Test vertical privilege escalation', 'Test horizontal privilege escalation', 'Verify permission boundaries', 'Check admin function access'];
        default:
            return ['Manual security review'];
    }
}

function canAutomate(threat: Threat): boolean {
    return threat.category !== 'Repudiation';
}

function getSecurityTools(threat: Threat): string[] {
    switch (threat.category) {
        case 'Spoofing': return ['Burp Suite', 'OWASP ZAP', 'Selenium'];
        case 'Tampering': return ['Postman', 'Burp Suite', 'Custom scripts'];
        case 'Information Disclosure': return ['SSLyze', 'testssl.sh', 'Burp Suite'];
        case 'Denial of Service': return ['JMeter', 'Locust', 'Artillery'];
        case 'Elevation of Privilege': return ['Burp Suite', 'Custom scripts'];
        default: return ['Manual testing'];
    }
}
