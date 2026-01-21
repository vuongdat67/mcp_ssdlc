// Business Analyst Tool - Domain-aware
import type {
    UserStory,
    SecurityRequirement,
    AbuseCase,
    BAOutput,
} from '../../types/tools.js';
import type { LoadedDomain } from '../../domains/loader.js';

export interface BAInput {
    projectDescription: string;
    businessGoals: string[];
    domain?: LoadedDomain;
}

/**
 * Generate BA analysis with user stories, security requirements, abuse cases
 */
export function analyzeRequirements(input: BAInput): BAOutput {
    const { projectDescription, businessGoals, domain } = input;

    const userStories = generateUserStories(businessGoals, domain);
    const securityRequirements = generateSecurityRequirements(projectDescription, domain);
    const abuseCases = generateAbuseCases(userStories, domain);

    const dataClassification = domain?.domain.dataClassification || {
        critical: ['Passwords', 'API Keys'],
        high: ['PII', 'Email'],
        medium: ['Preferences'],
        low: ['Public data']
    };

    return {
        projectName: extractProjectName(projectDescription),
        userStories,
        securityRequirements,
        abuseCases,
        dataClassification
    };
}

function generateUserStories(goals: string[], domain?: LoadedDomain): UserStory[] {
    const stories: UserStory[] = [];
    let id = 1;

    for (const goal of goals) {
        stories.push({
            id: `US-${String(id).padStart(3, '0')}`,
            title: goalToTitle(goal),
            asA: determineActor(goal, domain),
            iWant: goal,
            soThat: 'the system meets business requirements',
            priority: determinePriority(goal),
            acceptanceCriteria: [
                `Given I am authenticated`,
                `When I ${goal.toLowerCase()}`,
                `Then the action completes successfully`,
                `And an audit log is created`
            ],
            securityConsiderations: getSecurityConsiderations(goal),
            estimatedEffort: 'Medium'
        });
        id++;
    }

    stories.push({
        id: `US-${String(id).padStart(3, '0')}`,
        title: 'Secure Authentication',
        asA: 'user',
        iWant: 'to authenticate securely with MFA',
        soThat: 'my account is protected',
        priority: 'P0',
        acceptanceCriteria: [
            'MFA is required for all users',
            'Password meets complexity requirements',
            'Session expires after inactivity',
            'Failed attempts are rate-limited'
        ],
        securityConsiderations: ['Brute force protection', 'Session management'],
        estimatedEffort: 'Large'
    });
    id++;

    stories.push({
        id: `US-${String(id).padStart(3, '0')}`,
        title: 'Audit Logging',
        asA: 'compliance officer',
        iWant: 'comprehensive audit logs',
        soThat: 'I can investigate security incidents',
        priority: 'P0',
        acceptanceCriteria: [
            'All data access is logged',
            'Logs are tamper-proof',
            'Logs include user, timestamp, action',
            'Log retention meets compliance requirements'
        ],
        securityConsiderations: ['Log integrity', 'PII in logs'],
        estimatedEffort: 'Medium'
    });

    return stories;
}

function generateSecurityRequirements(description: string, domain?: LoadedDomain): SecurityRequirement[] {
    const requirements: SecurityRequirement[] = [];
    let id = 1;

    const standardReqs: Array<{ category: string; req: string; priority: 'critical' | 'high' | 'medium' | 'low' }> = [
        { category: 'Authentication', req: 'Implement multi-factor authentication', priority: 'critical' },
        { category: 'Authorization', req: 'Implement role-based access control (RBAC)', priority: 'critical' },
        { category: 'Encryption', req: 'Encrypt sensitive data at rest (AES-256)', priority: 'critical' },
        { category: 'Encryption', req: 'Use TLS 1.3 for data in transit', priority: 'critical' },
        { category: 'Input Validation', req: 'Validate and sanitize all user input', priority: 'high' },
        { category: 'Logging', req: 'Implement comprehensive audit logging', priority: 'high' },
        { category: 'Session', req: 'Secure session management with timeout', priority: 'high' },
    ];

    for (const req of standardReqs) {
        requirements.push({
            id: `SR-${String(id).padStart(3, '0')}`,
            category: req.category,
            requirement: req.req,
            priority: req.priority,
            complianceMapping: getComplianceMapping(req.category, domain)
        });
        id++;
    }

    if (domain?.compliance?.regulations) {
        for (const reg of domain.compliance.regulations) {
            for (const req of reg.requirements.slice(0, 3)) {
                requirements.push({
                    id: `SR-${String(id).padStart(3, '0')}`,
                    category: reg.name,
                    requirement: `${req.name}: ${req.description}`,
                    priority: 'critical',
                    complianceMapping: [reg.name]
                });
                id++;
            }
        }
    }

    return requirements;
}

function generateAbuseCases(stories: UserStory[], domain?: LoadedDomain): AbuseCase[] {
    const abuseCases: AbuseCase[] = [];
    let id = 1;

    const standardAbuse: Array<Omit<AbuseCase, 'id'>> = [
        {
            title: 'Credential Stuffing Attack',
            asA: 'attacker',
            iWant: 'to use stolen credentials',
            soThat: 'I can access user accounts',
            likelihood: 'high',
            impact: 'critical',
            mitigation: 'MFA, rate limiting, credential monitoring'
        },
        {
            title: 'Privilege Escalation',
            asA: 'malicious user',
            iWant: 'to gain admin access',
            soThat: 'I can access all data',
            likelihood: 'medium',
            impact: 'critical',
            mitigation: 'Strict RBAC, principle of least privilege'
        },
        {
            title: 'Data Exfiltration',
            asA: 'insider threat',
            iWant: 'to export sensitive data',
            soThat: 'I can sell or leak it',
            likelihood: 'medium',
            impact: 'critical',
            mitigation: 'DLP, audit logging, data access monitoring'
        },
        {
            title: 'Injection Attack',
            asA: 'attacker',
            iWant: 'to inject malicious code',
            soThat: 'I can execute unauthorized operations',
            likelihood: 'high',
            impact: 'high',
            mitigation: 'Input validation, parameterized queries, WAF'
        }
    ];

    for (const abuse of standardAbuse) {
        abuseCases.push({
            id: `AC-${String(id).padStart(3, '0')}`,
            ...abuse
        });
        id++;
    }

    // Add domain-specific abuse cases - convert to lowercase
    if (domain?.threats) {
        for (const threat of domain.threats.slice(0, 3)) {
            abuseCases.push({
                id: `AC-${String(id).padStart(3, '0')}`,
                title: threat.name,
                asA: 'attacker',
                iWant: `to exploit ${threat.category.toLowerCase()}`,
                soThat: threat.description,
                likelihood: threat.likelihood as AbuseCase['likelihood'],
                impact: threat.impact as AbuseCase['impact'],
                mitigation: threat.mitigation
            });
            id++;
        }
    }

    return abuseCases;
}

// Helper functions
function extractProjectName(description: string): string {
    return description.split(' ').slice(0, 5).join(' ');
}

function goalToTitle(goal: string): string {
    const words = goal.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : goal;
}

function determineActor(goal: string, domain?: LoadedDomain): string {
    const goalLower = goal.toLowerCase();
    if (goalLower.includes('admin') || goalLower.includes('manage')) return 'admin';
    if (goalLower.includes('compliance') || goalLower.includes('audit')) return 'compliance officer';
    if (goalLower.includes('security')) return 'security team';
    if (domain?.domain.stakeholders.length) {
        return domain.domain.stakeholders[0].name.toLowerCase();
    }
    return 'user';
}

function determinePriority(goal: string): 'P0' | 'P1' | 'P2' | 'P3' {
    const goalLower = goal.toLowerCase();
    if (goalLower.includes('security') || goalLower.includes('compliance') || goalLower.includes('critical')) return 'P0';
    if (goalLower.includes('important') || goalLower.includes('core')) return 'P1';
    return 'P2';
}

function getSecurityConsiderations(goal: string): string[] {
    const considerations: string[] = [];
    const goalLower = goal.toLowerCase();
    if (goalLower.includes('data') || goalLower.includes('record')) {
        considerations.push('Data encryption required', 'Access control validation');
    }
    if (goalLower.includes('user') || goalLower.includes('access')) {
        considerations.push('Authentication required', 'Session management');
    }
    if (goalLower.includes('payment') || goalLower.includes('financial')) {
        considerations.push('PCI-DSS compliance', 'Transaction integrity');
    }
    if (considerations.length === 0) {
        considerations.push('Input validation', 'Audit logging');
    }
    return considerations;
}

function getComplianceMapping(category: string, domain?: LoadedDomain): string[] {
    const mappings: string[] = [];
    if (domain?.compliance?.regulations) {
        for (const reg of domain.compliance.regulations) {
            mappings.push(reg.name);
        }
    }
    if (category === 'Authentication' || category === 'Authorization') mappings.push('OWASP-A07');
    if (category === 'Encryption') mappings.push('OWASP-A02');
    return mappings;
}
