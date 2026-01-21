// Coding Assistant Tool - SSDLC Integration for AI Coding Agents
// Provides context-aware coding assistance following SSDLC principles

import type { LoadedDomain } from '../../domains/loader.js';
import type { Module, Feature, ClassDefinition } from '../../types/tech-lead.js';
import type { Threat } from '../../types/tools.js';

export interface CodingContext {
    projectName: string;
    domain?: LoadedDomain;
    currentFile?: string;
    currentFunction?: string;
    modules?: Module[];
    threats?: Threat[];
    securityRequirements?: string[];
}

export interface CodeSuggestion {
    type: 'security' | 'performance' | 'quality' | 'architecture';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    codeSnippet?: string;
    relatedThreats?: string[];
    compliance?: string[];
}

export interface SecurityCheck {
    passed: boolean;
    issues: SecurityIssue[];
    score: number;
}

export interface SecurityIssue {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    line?: number;
    column?: number;
    cwe?: string;
    owasp?: string;
    fix?: string;
}

export interface CodingGuidelines {
    domain: string;
    language: string;
    patterns: DesignPattern[];
    securityRules: SecurityRule[];
    bestPractices: string[];
}

export interface DesignPattern {
    name: string;
    when: string;
    example: string;
}

export interface SecurityRule {
    id: string;
    name: string;
    description: string;
    pattern: string;
    fix: string;
}

/**
 * Generate coding guidelines based on domain and context
 */
export function generateCodingGuidelines(
    domain: LoadedDomain,
    language: string
): CodingGuidelines {
    const guidelines: CodingGuidelines = {
        domain: domain.name,
        language,
        patterns: [],
        securityRules: [],
        bestPractices: []
    };

    // Add domain-specific patterns
    guidelines.patterns = getDomainPatterns(domain.name, language);

    // Add security rules based on domain
    guidelines.securityRules = getSecurityRules(domain, language);

    // Add best practices
    guidelines.bestPractices = getBestPractices(domain.name, language);

    return guidelines;
}

/**
 * Analyze code for security issues
 */
export function analyzeCodeSecurity(
    code: string,
    language: string,
    domain?: LoadedDomain
): SecurityCheck {
    const issues: SecurityIssue[] = [];
    const lines = code.split('\n');
    let issueId = 1;

    // Common security patterns to check
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // SQL Injection
        if (/query\s*\(.*\+.*\)|execute\s*\(.*\+/.test(line)) {
            issues.push({
                id: `SEC-${String(issueId++).padStart(3, '0')}`,
                severity: 'critical',
                title: 'Potential SQL Injection',
                description: 'String concatenation in SQL query detected',
                line: lineNum,
                cwe: 'CWE-89',
                owasp: 'A03:2021',
                fix: 'Use parameterized queries or prepared statements'
            });
        }

        // Hardcoded secrets
        if (/password\s*=\s*['"][^'"]+['"]|api_key\s*=\s*['"][^'"]+['"]/i.test(line)) {
            issues.push({
                id: `SEC-${String(issueId++).padStart(3, '0')}`,
                severity: 'critical',
                title: 'Hardcoded Secret',
                description: 'Sensitive data hardcoded in source code',
                line: lineNum,
                cwe: 'CWE-798',
                owasp: 'A07:2021',
                fix: 'Use environment variables or secret management'
            });
        }

        // Eval usage
        if (/eval\s*\(/.test(line)) {
            issues.push({
                id: `SEC-${String(issueId++).padStart(3, '0')}`,
                severity: 'high',
                title: 'Dangerous eval() usage',
                description: 'eval() can execute arbitrary code',
                line: lineNum,
                cwe: 'CWE-95',
                owasp: 'A03:2021',
                fix: 'Use safer alternatives like JSON.parse()'
            });
        }

        // Weak crypto
        if (/md5|sha1\s*\(/i.test(line)) {
            issues.push({
                id: `SEC-${String(issueId++).padStart(3, '0')}`,
                severity: 'medium',
                title: 'Weak Cryptographic Hash',
                description: 'MD5/SHA1 are cryptographically weak',
                line: lineNum,
                cwe: 'CWE-328',
                fix: 'Use SHA-256 or stronger algorithms'
            });
        }

        // Insecure random
        if (/Math\.random\s*\(/.test(line) && domain?.name !== 'generic') {
            issues.push({
                id: `SEC-${String(issueId++).padStart(3, '0')}`,
                severity: 'medium',
                title: 'Insecure Random Number Generation',
                description: 'Math.random() is not cryptographically secure',
                line: lineNum,
                cwe: 'CWE-330',
                fix: 'Use crypto.getRandomValues() or crypto.randomBytes()'
            });
        }

        // Domain-specific checks
        if (domain) {
            const domainIssues = checkDomainSpecific(line, lineNum, domain, issueId);
            issues.push(...domainIssues);
            issueId += domainIssues.length;
        }
    }

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const mediumCount = issues.filter(i => i.severity === 'medium').length;

    // Calculate security score (0-100)
    const score = Math.max(0, 100 - (criticalCount * 25) - (highCount * 10) - (mediumCount * 5));

    return {
        passed: criticalCount === 0 && highCount === 0,
        issues,
        score
    };
}

/**
 * Generate code suggestions based on context
 */
export function generateCodeSuggestions(
    context: CodingContext
): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Security suggestions based on threats
    if (context.threats) {
        for (const threat of context.threats.slice(0, 5)) {
            suggestions.push({
                type: 'security',
                severity: threat.impact === 'critical' ? 'critical' : 'warning',
                title: `Mitigate: ${threat.name}`,
                description: `Implement protection against ${threat.category}`,
                relatedThreats: [threat.id],
                codeSnippet: getSecuritySnippet(threat)
            });
        }
    }

    // Domain-specific suggestions
    if (context.domain) {
        const domainSuggestions = getDomainSuggestions(context.domain);
        suggestions.push(...domainSuggestions);
    }

    // Architecture suggestions based on modules
    if (context.modules) {
        const archSuggestions = getArchitectureSuggestions(context.modules);
        suggestions.push(...archSuggestions);
    }

    return suggestions;
}

/**
 * Get secure code template for a feature
 */
export function getSecureTemplate(
    feature: Feature,
    language: string,
    domain?: LoadedDomain
): string {
    const templates: Record<string, Record<string, string>> = {
        typescript: {
            authentication: `
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export class AuthService {
    private readonly SALT_ROUNDS = 12;
    private readonly JWT_SECRET = process.env.JWT_SECRET!;
    private readonly JWT_EXPIRY = '1h';

    async hashPassword(password: string): Promise<string> {
        return hash(password, this.SALT_ROUNDS);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return compare(password, hash);
    }

    generateToken(userId: string, role: string): string {
        return sign(
            { sub: userId, role },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRY }
        );
    }

    verifyToken(token: string): { sub: string; role: string } {
        return verify(token, this.JWT_SECRET) as { sub: string; role: string };
    }
}
`,
            api_endpoint: `
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';

// Input validation schema
const RequestSchema = z.object({
    id: z.string().uuid(),
    data: z.string().max(1000)
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100


});

export async function handler(req: Request, res: Response) {
    try {
        // Validate input
        const input = RequestSchema.parse(req.body);
        
        // Process request
        const result = await processRequest(input);
        
        // Return response
        return res.json({ success: true, data: result });
    } catch (error) {
        // Log error (sanitized)
        logger.error('Request failed', { error: error.message });
        
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid request' 
        });
    }
}
`,
            database: `
import { Pool } from 'pg';

export class DatabaseService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: { rejectUnauthorized: true },
            max: 20,
            idleTimeoutMillis: 30000
        });
    }

    // Always use parameterized queries
    async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows as T[];
        } finally {
            client.release();
        }
    }

    // Example: Safe user lookup
    async findUserById(id: string): Promise<User | null> {
        const users = await this.query<User>(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return users[0] || null;
    }
}
`
        }
    };

    const featureType = identifyFeatureType(feature);
    return templates[language]?.[featureType] || `// Template for ${feature.name}\n// TODO: Implement secure ${featureType}`;
}

// ==================== HELPERS ====================

function getDomainPatterns(domain: string, language: string): DesignPattern[] {
    const patterns: DesignPattern[] = [];

    switch (domain) {
        case 'secure_comm':
            patterns.push({
                name: 'Double Ratchet',
                when: 'Implementing end-to-end encrypted messaging',
                example: 'Use Signal Protocol for session key rotation'
            });
            break;
        case 'fintech':
            patterns.push({
                name: 'Event Sourcing',
                when: 'Handling financial transactions',
                example: 'Store all state changes as immutable events'
            });
            break;
        case 'healthcare':
            patterns.push({
                name: 'RBAC with Consent',
                when: 'Accessing patient data',
                example: 'Verify consent before data access'
            });
            break;
    }

    return patterns;
}

function getSecurityRules(domain: LoadedDomain, language: string): SecurityRule[] {
    const rules: SecurityRule[] = [
        {
            id: 'SEC-001',
            name: 'Input Validation',
            description: 'All user input must be validated',
            pattern: 'req.body|req.params|req.query',
            fix: 'Use Zod/Joi schema validation'
        },
        {
            id: 'SEC-002',
            name: 'Output Encoding',
            description: 'Encode output to prevent XSS',
            pattern: 'innerHTML|dangerouslySetInnerHTML',
            fix: 'Use textContent or sanitization library'
        }
    ];

    // Add domain-specific rules
    if (domain.compliance?.regulations) {
        for (const reg of domain.compliance.regulations) {
            rules.push({
                id: `COMP-${reg.name}`,
                name: `${reg.name} Compliance`,
                description: reg.fullName || reg.name,
                pattern: '*',
                fix: 'Implement required controls'
            });
        }
    }

    return rules;
}

function getBestPractices(domain: string, language: string): string[] {
    const common = [
        'Use parameterized queries for all database operations',
        'Implement rate limiting on all API endpoints',
        'Use HTTPS/TLS for all communications',
        'Log security events with audit trail',
        'Implement proper error handling without exposing internals'
    ];

    const domainSpecific: Record<string, string[]> = {
        healthcare: [
            'Encrypt all PHI at rest and in transit',
            'Implement minimum necessary access principle',
            'Maintain audit logs for 6+ years'
        ],
        fintech: [
            'Use tokenization for sensitive payment data',
            'Implement transaction signing',
            'Follow PCI-DSS requirements'
        ],
        secure_comm: [
            'Implement perfect forward secrecy',
            'Use authenticated encryption (AES-GCM)',
            'Rotate keys regularly'
        ]
    };

    return [...common, ...(domainSpecific[domain] || [])];
}

function checkDomainSpecific(
    line: string,
    lineNum: number,
    domain: LoadedDomain,
    startId: number
): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    if (domain.name === 'healthcare') {
        // Check for PHI exposure
        if (/console\.log.*patient|console\.log.*medical/i.test(line)) {
            issues.push({
                id: `SEC-${String(startId).padStart(3, '0')}`,
                severity: 'critical',
                title: 'PHI Exposure in Logs',
                description: 'Patient data may be exposed in logs',
                line: lineNum,
                cwe: 'CWE-532',
                fix: 'Use structured logging with data masking'
            });
        }
    }

    if (domain.name === 'fintech') {
        // Check for PAN exposure
        if (/console\.log.*card|console\.log.*account/i.test(line)) {
            issues.push({
                id: `SEC-${String(startId).padStart(3, '0')}`,
                severity: 'critical',
                title: 'Payment Data Exposure',
                description: 'Payment data may be exposed in logs',
                line: lineNum,
                cwe: 'CWE-311',
                fix: 'Mask or tokenize payment data before logging'
            });
        }
    }

    return issues;
}

function getSecuritySnippet(threat: Threat): string {
    const snippets: Record<string, string> = {
        'Spoofing': `
// Implement authentication
const token = await verifyJWT(request.headers.authorization);
if (!token.valid) throw new UnauthorizedError();
`,
        'Tampering': `
// Verify data integrity
const hash = crypto.createHash('sha256').update(data).digest('hex');
if (hash !== expectedHash) throw new IntegrityError();
`,
        'Information Disclosure': `
// Encrypt sensitive data
const encrypted = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = encrypted.update(plaintext, 'utf8', 'base64');
`
    };

    return snippets[threat.category] || '// TODO: Implement mitigation';
}

function getDomainSuggestions(domain: LoadedDomain): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (domain.compliance?.regulations) {
        for (const reg of domain.compliance.regulations) {
            suggestions.push({
                type: 'security',
                severity: 'info',
                title: `${reg.name} Compliance`,
                description: `Ensure ${reg.fullName} requirements are met`,
                compliance: [reg.name]
            });
        }
    }

    return suggestions;
}

function getArchitectureSuggestions(modules: Module[]): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Check for common architecture issues
    const serviceModules = modules.filter(m => m.type === 'service');
    if (serviceModules.length > 5) {
        suggestions.push({
            type: 'architecture',
            severity: 'info',
            title: 'Consider Service Decomposition',
            description: 'Large number of services may benefit from domain boundaries'
        });
    }

    return suggestions;
}

function identifyFeatureType(feature: Feature): string {
    const name = feature.name.toLowerCase();

    if (name.includes('auth') || name.includes('login')) return 'authentication';
    if (name.includes('api') || name.includes('endpoint')) return 'api_endpoint';
    if (name.includes('database') || name.includes('data')) return 'database';

    return 'generic';
}
