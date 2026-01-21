// ==================== src/tools/architecture/adr-generator.ts ====================
// Architecture Decision Records (ADR) Generator
// Follows Michael Nygard's ADR format

import type { Module } from '../../types/tech-lead.js';
import type { LoadedDomain } from '../../domains/loader.js';

export interface ADRInput {
    modules: Module[];
    techStack: string[];
    domain?: LoadedDomain;
    projectName: string;
    constraints: ProjectConstraint[];
}

export interface ADROutput {
    decisions: ArchitectureDecision[];
    tradeoffAnalysis: TradeoffMatrix;
    technologyComparison: TechComparison[];
    summary: ADRSummary;
}

export interface ArchitectureDecision {
    id: string; // "ADR-001"
    title: string;
    status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
    date: string; // ISO date
    context: string; // Problem statement
    decisionDrivers: string[]; // What factors influenced this decision
    options: DecisionOption[];
    decision: string; // Final choice + rationale
    consequences: Consequence[];
    relatedDecisions: string[]; // ADR IDs
    complianceImpact?: string[]; // Which compliance requirements affected this
}

export interface DecisionOption {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    cost: 'low' | 'medium' | 'high';
    complexity: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
    score: number; // Weighted score (0-100)
}

export interface Consequence {
    type: 'positive' | 'negative' | 'neutral';
    description: string;
    impactArea: 'performance' | 'security' | 'maintainability' | 'cost' | 'scalability' | 'compliance';
    severity: 'low' | 'medium' | 'high';
}

export interface ProjectConstraint {
    type: 'budget' | 'timeline' | 'technology' | 'regulation' | 'team_skill';
    description: string;
    hardConstraint: boolean; // true = cannot be changed
    impact: string; // How this affects architecture decisions
}

export interface TradeoffMatrix {
    dimensions: string[]; // ["Performance", "Security", "Cost"]
    comparisons: TradeoffComparison[];
}

export interface TradeoffComparison {
    optionA: string;
    optionB: string;
    winnerByDimension: Record<string, string>; // dimension -> winner
    overallRecommendation: string;
}

export interface TechComparison {
    category: string; // "Database", "API Framework", "Authentication"
    options: TechnologyOption[];
    recommendation: string;
    justification: string;
}

export interface TechnologyOption {
    name: string;
    maturity: 'experimental' | 'emerging' | 'mature' | 'legacy';
    communitySupport: 'low' | 'medium' | 'high';
    learningCurve: 'low' | 'medium' | 'high';
    performanceRating: number; // 1-10
    securityRating: number; // 1-10
    costRating: number; // 1-10 (10 = cheapest)
}

export interface ADRSummary {
    totalDecisions: number;
    acceptedDecisions: number;
    keyDecisionAreas: string[];
    highRiskDecisions: string[]; // ADR IDs with high-risk consequences
}

/**
 * Main ADR Generator Entry Point
 */
export function generateADRs(input: ADRInput): ADROutput {
    // STEP 1: Identify key architectural decisions needed
    const decisionAreas = identifyDecisionAreas(input.modules, input.domain);

    // STEP 2: Generate ADR for each decision area
    const decisions: ArchitectureDecision[] = [];
    let adrId = 1;

    for (const area of decisionAreas) {
        const adr = generateADR(
            adrId,
            area,
            input.techStack,
            input.domain,
            input.constraints
        );
        decisions.push(adr);
        adrId++;
    }

    // STEP 3: Generate tradeoff analysis
    const tradeoffAnalysis = generateTradeoffMatrix(decisions);

    // STEP 4: Generate technology comparison tables
    const technologyComparison = generateTechComparison(input.techStack, input.domain);

    // STEP 5: Create summary
    const summary: ADRSummary = {
        totalDecisions: decisions.length,
        acceptedDecisions: decisions.filter(d => d.status === 'accepted').length,
        keyDecisionAreas: decisionAreas,
        highRiskDecisions: decisions
            .filter(d => d.consequences.some(c => c.type === 'negative' && c.severity === 'high'))
            .map(d => d.id)
    };

    return {
        decisions,
        tradeoffAnalysis,
        technologyComparison,
        summary
    };
}

/**
 * Identify key decision areas based on system requirements
 */
function identifyDecisionAreas(modules: Module[], domain?: LoadedDomain): string[] {
    const areas: string[] = [];

    // DECISION AREA 1: Database Technology
    areas.push('Database Technology Selection');

    // DECISION AREA 2: API Architecture Style
    if (modules.some(m => m.type === 'controller')) {
        areas.push('API Architecture Style');
    }

    // DECISION AREA 3: Authentication & Authorization
    if (modules.some(m => m.name.toLowerCase().includes('auth') || m.name.toLowerCase().includes('security'))) {
        areas.push('Authentication & Authorization Mechanism');
    }

    // DECISION AREA 4: Data Encryption Strategy
    if (domain?.domain.sensitiveData.some(sd => sd.encryption === 'required')) {
        areas.push('Data Encryption Strategy');
    }

    // DECISION AREA 5: Caching Strategy
    areas.push('Caching Strategy');

    // DECISION AREA 6: Logging & Monitoring
    areas.push('Logging & Monitoring Solution');

    // DECISION AREA 7: Deployment Architecture
    areas.push('Deployment Architecture');

    // DECISION AREA 8: Error Handling & Resilience
    areas.push('Error Handling & Resilience Patterns');

    // Domain-specific decisions
    if (domain?.name === 'secure_comm') {
        areas.push('End-to-End Encryption Protocol');
        areas.push('Key Exchange Mechanism');
    }

    if (domain?.name === 'malware_analysis') {
        areas.push('Sandbox Isolation Technology');
        areas.push('Static Analysis Engine');
    }

    if (domain?.name === 'blockchain') {
        areas.push('Consensus Algorithm');
        areas.push('Smart Contract Language');
    }

    if (domain?.name === 'ml_ai') {
        areas.push('Model Serving Architecture');
        areas.push('Feature Store Selection');
        areas.push('Adversarial Defense Strategy');
    }

    if (domain?.name === 'networksec') {
        areas.push('IDS/IPS Deployment Mode');
        areas.push('Packet Capture Strategy');
    }

    if (domain?.name === 'websec') {
        areas.push('WAF Architecture');
        areas.push('Bot Detection Strategy');
    }

    if (domain?.name === 'appsec') {
        areas.push('SAST Tool Selection');
        areas.push('Security Testing Pipeline');
    }

    return areas;
}

/**
 * Generate individual ADR document
 */
function generateADR(
    id: number,
    area: string,
    techStack: string[],
    domain: LoadedDomain | undefined,
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    const adrId = `ADR-${String(id).padStart(3, '0')}`;

    // Route to specific ADR generator based on area
    switch (area) {
        case 'Database Technology Selection':
            return generateDatabaseADR(adrId, techStack, constraints);
        case 'API Architecture Style':
            return generateAPIStyleADR(adrId, constraints);
        case 'Authentication & Authorization Mechanism':
            return generateAuthADR(adrId, domain, constraints);
        case 'Data Encryption Strategy':
            return generateEncryptionADR(adrId, domain, constraints);
        case 'Caching Strategy':
            return generateCachingADR(adrId, constraints);
        case 'Logging & Monitoring Solution':
            return generateLoggingADR(adrId, constraints);
        case 'Deployment Architecture':
            return generateDeploymentADR(adrId, constraints);
        case 'Error Handling & Resilience Patterns':
            return generateErrorHandlingADR(adrId, constraints);
        case 'End-to-End Encryption Protocol':
            return generateE2EEADR(adrId, domain);
        case 'Sandbox Isolation Technology':
            return generateSandboxADR(adrId);
        case 'Consensus Algorithm':
            return generateConsensusADR(adrId);
        // ML/AI domain
        case 'Model Serving Architecture':
            return generateModelServingADR(adrId);
        case 'Feature Store Selection':
            return generateGenericADR(adrId, area, constraints);
        case 'Adversarial Defense Strategy':
            return generateGenericADR(adrId, area, constraints);
        // Network Security domain
        case 'IDS/IPS Deployment Mode':
            return generateIDSDeploymentADR(adrId);
        case 'Packet Capture Strategy':
            return generateGenericADR(adrId, area, constraints);
        // Web Security domain
        case 'WAF Architecture':
            return generateWAFArchitectureADR(adrId);
        case 'Bot Detection Strategy':
            return generateGenericADR(adrId, area, constraints);
        // AppSec domain
        case 'SAST Tool Selection':
            return generateSASTToolADR(adrId);
        case 'Security Testing Pipeline':
            return generateGenericADR(adrId, area, constraints);
        default:
            return generateGenericADR(adrId, area, constraints);
    }
}

/**
 * Generate ADR for Database Technology Selection
 */
function generateDatabaseADR(
    id: string,
    techStack: string[],
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    return {
        id,
        title: 'Database Technology Selection',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need to select a database technology that:
- Handles structured data with complex relationships
- Supports ACID transactions for data integrity
- Provides strong consistency guarantees
- Scales horizontally for future growth
- Has robust security features (encryption, RBAC)
        `.trim(),
        decisionDrivers: [
            'Read/write ratio (80/20)',
            'Cache hit rate target (>80%)',
            'Latency requirements (<200ms)',
            'Data consistency requirements',
            'Cache invalidation complexity'
        ],
        options: [
            {
                name: 'Redis (Centralized Cache)',
                description: 'In-memory data store as shared cache layer',
                pros: [
                    'Fast reads (<1ms latency)',
                    'Rich data structures (strings, hashes, sets, sorted sets)',
                    'Built-in TTL (time-to-live)',
                    'Pub/sub for cache invalidation',
                    'Persistence options (RDB, AOF)'
                ],
                cons: [
                    'Single point of failure (need Redis Cluster)',
                    'Memory cost (expensive for large datasets)',
                    'Network hop adds latency',
                    'Cache invalidation still manual'
                ],
                cost: 'medium',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'In-Memory Cache (Application-Level)',
                description: 'Cache data in application memory (Node.js Map, LRU cache)',
                pros: [
                    'Zero network latency',
                    'Simple implementation',
                    'No additional infrastructure',
                    'Good for small, frequently accessed data'
                ],
                cons: [
                    'Each instance has separate cache (cache duplication)',
                    'Invalidation harder in multi-instance setup',
                    'Memory limit per instance',
                    'Lost on application restart'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'medium',
                score: 65
            },
            {
                name: 'HTTP Caching (Client-Side + CDN)',
                description: 'Use HTTP cache headers (ETag, Cache-Control)',
                pros: [
                    'Offloads server completely',
                    'Works with CDN (CloudFlare, Cloudfront)',
                    'Standard HTTP semantics',
                    'Browser caching reduces requests'
                ],
                cons: [
                    'Only for GET requests',
                    'Client controls cache (can be ignored)',
                    'Invalidation via ETags (304 Not Modified)',
                    'Not suitable for authenticated endpoints'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'low',
                score: 70
            }
        ],
        decision: `
**Selected: Multi-Layer Caching (Redis + HTTP Caching)**

Caching layers:

**Layer 1: HTTP Caching (Edge/Client)**
- Public endpoints: Cache-Control: public, max-age=3600
- ETag for conditional requests (304 Not Modified)
- CDN for static assets and public API responses

**Layer 2: Redis (Application Cache)**
- User sessions (TTL: 7 days)
- Frequently accessed data (user profiles, config)
- Query result cache (TTL: 5-60 minutes based on volatility)
- Rate limiting counters (sliding window)

**Layer 3: Database Query Cache**
- PostgreSQL query result cache (built-in)
- Prepared statements reduce parse overhead

**Cache Invalidation Strategy:**
1. **Time-based (TTL)**: Default approach, safe but may serve stale data
2. **Event-based**: Invalidate on write operations (pub/sub)
3. **Cache-aside pattern**: Application checks cache → miss → query DB → populate cache

**Implementation pseudocode:**
\`\`\`typescript
class CacheService {
    async get<T>(key: string): Promise<T | null> {
        // STEP 1: Try Redis cache
        const cached = await redis.get(key);
        if (cached) {
            return JSON.parse(cached);
        }
        
        // STEP 2: Cache miss - return null (caller queries DB)
        return null;
    }
    
    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        // STEP 1: Serialize to JSON
        // STEP 2: Store in Redis with TTL
        await redis.setex(key, ttl, JSON.stringify(value));
    }
    
    async invalidate(pattern: string): Promise<void> {
        // STEP 1: Find all keys matching pattern
        const keys = await redis.keys(pattern);
        
        // STEP 2: Delete in batch
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        
        // STEP 3: Publish invalidation event for other instances
        await redis.publish('cache:invalidate', pattern);
    }
}

// Usage in service layer
async getUserById(id: string): Promise<User> {
    const cacheKey = \`user:\${id}\`;
    
    // Try cache
    let user = await cache.get<User>(cacheKey);
    
    if (!user) {
        // Cache miss - query database
        user = await db.users.findOne({ id });
        
        // Populate cache (TTL: 1 hour)
        if (user) {
            await cache.set(cacheKey, user, 3600);
        }
    }
    
    return user;
}

// Invalidate on update
async updateUser(id: string, data: Partial<User>): Promise<User> {
    // Update database
    const updated = await db.users.update({ id }, data);
    
    // Invalidate cache
    await cache.invalidate(\`user:\${id}\`);
    
    return updated;
}
\`\`\`

**Monitoring:**
- Track cache hit rate (target: >80%)
- Monitor Redis memory usage
- Alert if hit rate drops below 70%
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Database load reduced by 70-80% (read offloading)',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'API latency improved (<50ms for cached responses)',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Stale data possible (TTL-based invalidation)',
                impactArea: 'security',
                severity: 'low'
            },
            {
                type: 'negative',
                description: 'Redis adds operational complexity (monitoring, backup)',
                impactArea: 'maintainability',
                severity: 'medium'
            },
            {
                type: 'positive',
                description: 'Horizontal scaling without database bottleneck',
                impactArea: 'scalability',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-001', 'ADR-002'],
        complianceImpact: []
    };
}

/**
 * Generate ADR for E2EE Protocol (Signal Protocol)
 */
function generateE2EEADR(id: string, domain: LoadedDomain | undefined): ArchitectureDecision {
    return {
        id,
        title: 'End-to-End Encryption Protocol',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
For secure messaging application, we need E2EE protocol that:
- Provides forward secrecy (past messages safe if key compromised)
- Provides future secrecy (future messages safe if key compromised)
- Supports asynchronous messaging (recipient offline)
- Supports multi-device per user
- Resistant to man-in-the-middle attacks
        `.trim(),
        decisionDrivers: [
            'Security requirements (E2EE, forward/future secrecy)',
            'Asynchronous messaging support',
            'Multi-device support',
            'Performance (encryption overhead)',
            'Protocol maturity and audit history'
        ],
        options: [
            {
                name: 'Signal Protocol (libsignal)',
                description: 'Double Ratchet + X3DH key agreement',
                pros: [
                    'Industry standard (WhatsApp, Signal, Facebook Messenger)',
                    'Forward secrecy via Double Ratchet',
                    'Future secrecy via ephemeral keys',
                    'Asynchronous support via PreKey bundles',
                    'Well-audited and battle-tested',
                    'Open-source implementations (libsignal-protocol-c, rust)'
                ],
                cons: [
                    'Complex state machine (ratcheting logic)',
                    'PreKey server required (infrastructure)',
                    'Message ordering dependencies',
                    'Multi-device requires additional protocol (Sesame)'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'low',
                score: 90
            },
            {
                name: 'Matrix Protocol (Olm/Megolm)',
                description: 'Double Ratchet with group messaging optimization',
                pros: [
                    'Built-in federation support',
                    'Group chat optimization (Megolm)',
                    'Decentralized architecture',
                    'Device verification built-in'
                ],
                cons: [
                    'Less mature than Signal Protocol',
                    'Complex server infrastructure (homeserver)',
                    'Group key management complexity',
                    'Smaller ecosystem'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'medium',
                score: 70
            },
            {
                name: 'Custom TLS + AES',
                description: 'Build custom encryption using standard primitives',
                pros: [
                    'Full control over implementation',
                    'Simpler than Signal Protocol',
                    'No external dependencies'
                ],
                cons: [
                    'No forward/future secrecy',
                    'Not battle-tested (security vulnerabilities likely)',
                    'Requires cryptography expertise',
                    'Industry will not trust custom crypto'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'high',
                score: 30
            }
        ],
        decision: `
**Selected: Signal Protocol (libsignal)**

The Signal Protocol is chosen because:
1. **Security guarantees**: Forward secrecy + future secrecy via Double Ratchet
2. **Industry standard**: Used by billions of users (WhatsApp, Signal, FB Messenger)
3. **Audited**: Multiple independent security audits, no critical vulnerabilities
4. **Asynchronous**: X3DH allows messaging offline users via PreKey bundles

**Architecture components:**

1. **X3DH (Extended Triple Diffie-Hellman)** - Initial key agreement
   - Alice retrieves Bob's PreKey bundle from server
   - Performs 4-way DH to establish shared secret
   - Initializes Double Ratchet session

2. **Double Ratchet** - Ongoing message encryption
   - Symmetric-key ratchet: Derives new message keys from chain key
   - Diffie-Hellman ratchet: New DH key pair for each message (forward secrecy)
   - Out-of-order message handling: Skipped message keys stored

3. **PreKey Server** - Distributes public key bundles
   - Identity Key (long-term)
   - Signed PreKey (medium-term, rotated monthly)
   - One-Time PreKeys (single-use, batch uploaded)

4. **Sesame Algorithm** (optional) - Multi-device support
   - Each device has own session with recipient
   - Sender encrypts once per device
   - Pairwise sessions (1-to-1 per device pair)

**Implementation plan:**
- Use libsignal-protocol-rust (memory-safe implementation)
- PreKey server as separate microservice (Go for performance)
- Message queue for offline delivery (RabbitMQ)
- Key backup with user passphrase encryption (optional recovery)

**Security properties:**
- ✅ Forward secrecy: Old messages safe if current key compromised
- ✅ Future secrecy: Future messages safe if old key compromised
- ✅ Deniability: Cannot prove who sent message (no non-repudiation)
- ✅ MITM protection: Identity key verification via safety numbers

**Threat mitigation:**
- Compromise of PreKey server: Only affects new sessions, existing sessions safe
- Compromise of message server: Cannot decrypt messages (E2EE)
- Device theft: Passphrase-protected key backup, remote wipe capability
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Military-grade security with forward/future secrecy',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Industry trust via well-audited protocol',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Complex implementation (ratcheting state machine)',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'PreKey server infrastructure required',
                impactArea: 'cost',
                severity: 'medium'
            },
            {
                type: 'negative',
                description: 'Out-of-order messages require buffering',
                impactArea: 'performance',
                severity: 'low'
            }
        ],
        relatedDecisions: ['ADR-004'],
        complianceImpact: ['GDPR (data minimization)', 'ePrivacy Directive (confidentiality)']
    };
}

/**
 * Generate tradeoff matrix for comparing options
 */
function generateTradeoffMatrix(decisions: ArchitectureDecision[]): TradeoffMatrix {
    // STEP 1: Extract all dimensions from consequences
    const dimensionSet = new Set<string>();
    for (const decision of decisions) {
        for (const consequence of decision.consequences) {
            dimensionSet.add(consequence.impactArea);
        }
    }

    // STEP 2: For each decision with multiple options, create comparison
    const comparisons: TradeoffComparison[] = [];

    for (const decision of decisions) {
        if (decision.options.length >= 2) {
            // Compare top 2 options
            const optionA = decision.options[0];
            const optionB = decision.options[1];

            const winnerByDimension: Record<string, string> = {};

            // Compare on each dimension
            for (const dimension of Array.from(dimensionSet)) {
                // Simple heuristic: higher score on relevant dimension wins
                if (dimension === 'performance') {
                    winnerByDimension[dimension] = optionA.complexity < optionB.complexity ? optionA.name : optionB.name;
                } else if (dimension === 'security') {
                    winnerByDimension[dimension] = optionA.riskLevel < optionB.riskLevel ? optionA.name : optionB.name;
                } else if (dimension === 'cost') {
                    winnerByDimension[dimension] = optionA.cost < optionB.cost ? optionA.name : optionB.name;
                } else {
                    winnerByDimension[dimension] = optionA.score > optionB.score ? optionA.name : optionB.name;
                }
            }

            comparisons.push({
                optionA: optionA.name,
                optionB: optionB.name,
                winnerByDimension,
                overallRecommendation: decision.decision.split('\n')[0].replace('**Selected:', '').replace('**', '').trim()
            });
        }
    }

    return {
        dimensions: Array.from(dimensionSet),
        comparisons
    };
}

/**
 * Generate technology comparison tables
 */
function generateTechComparison(techStack: string[], domain: LoadedDomain | undefined): TechComparison[] {
    const comparisons: TechComparison[] = [];

    // Database comparison
    comparisons.push({
        category: 'Database',
        options: [
            {
                name: 'PostgreSQL',
                maturity: 'mature',
                communitySupport: 'high',
                learningCurve: 'medium',
                performanceRating: 8,
                securityRating: 9,
                costRating: 10
            },
            {
                name: 'MongoDB',
                maturity: 'mature',
                communitySupport: 'high',
                learningCurve: 'low',
                performanceRating: 9,
                securityRating: 7,
                costRating: 8
            },
            {
                name: 'MySQL',
                maturity: 'mature',
                communitySupport: 'high',
                learningCurve: 'low',
                performanceRating: 7,
                securityRating: 8,
                costRating: 10
            }
        ],
        recommendation: 'PostgreSQL',
        justification: 'Strong ACID guarantees, excellent compliance features, mature security'
    });

    // API Framework comparison
    comparisons.push({
        category: 'API Framework',
        options: [
            {
                name: 'REST',
                maturity: 'mature',
                communitySupport: 'high',
                learningCurve: 'low',
                performanceRating: 7,
                securityRating: 9,
                costRating: 10
            },
            {
                name: 'GraphQL',
                maturity: 'mature',
                communitySupport: 'high',
                learningCurve: 'high',
                performanceRating: 8,
                securityRating: 7,
                costRating: 7
            },
            {
                name: 'gRPC',
                maturity: 'emerging',
                communitySupport: 'medium',
                learningCurve: 'high',
                performanceRating: 10,
                securityRating: 8,
                costRating: 8
            }
        ],
        recommendation: 'REST',
        justification: 'Industry standard, excellent tooling, easy to secure and scale'
    });

    return comparisons;
}

/**
 * Generate generic ADR template
 */
function generateGenericADR(
    id: string,
    area: string,
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    return {
        id,
        title: area,
        status: 'proposed',
        date: new Date().toISOString().split('T')[0],
        context: `Decision required for: ${area}`,
        decisionDrivers: ['To be determined'],
        options: [],
        decision: 'To be decided based on team discussion',
        consequences: [],
        relatedDecisions: [],
        complianceImpact: []
    };
}

/**
 * Export ADR as Markdown document (Michael Nygard format)
 */
export function exportADRAsMarkdown(adr: ArchitectureDecision): string {
    const lines: string[] = [];

    lines.push(`# ${adr.id}: ${adr.title}`);
    lines.push('');
    lines.push(`**Status**: ${adr.status.toUpperCase()}`);
    lines.push(`**Date**: ${adr.date}`);
    lines.push('');

    lines.push('## Context');
    lines.push('');
    lines.push(adr.context);
    lines.push('');

    lines.push('## Decision Drivers');
    lines.push('');
    adr.decisionDrivers.forEach(driver => lines.push(`- ${driver}`));
    lines.push('');

    lines.push('## Considered Options');
    lines.push('');
    adr.options.forEach(option => {
        lines.push(`### ${option.name}`);
        lines.push('');
        lines.push(option.description);
        lines.push('');
        lines.push('**Pros:**');
        option.pros.forEach(pro => lines.push(`- ✅ ${pro}`));
        lines.push('');
        lines.push('**Cons:**');
        option.cons.forEach(con => lines.push(`- ❌ ${con}`));
        lines.push('');
        lines.push(`**Metrics**: Cost: ${option.cost} | Complexity: ${option.complexity} | Risk: ${option.riskLevel} | Score: ${option.score}/100`);
        lines.push('');
    });

    lines.push('## Decision');
    lines.push('');
    lines.push(adr.decision);
    lines.push('');

    lines.push('## Consequences');
    lines.push('');
    adr.consequences.forEach(consequence => {
        const emoji = consequence.type === 'positive' ? '✅' : consequence.type === 'negative' ? '❌' : '➖';
        lines.push(`${emoji} **${consequence.impactArea}** (${consequence.severity}): ${consequence.description}`);
    });
    lines.push('');

    if (adr.complianceImpact && adr.complianceImpact.length > 0) {
        lines.push('## Compliance Impact');
        lines.push('');
        adr.complianceImpact.forEach(impact => lines.push(`- ${impact}`));
        lines.push('');
    }

    if (adr.relatedDecisions.length > 0) {
        lines.push('## Related Decisions');
        lines.push('');
        adr.relatedDecisions.forEach(related => lines.push(`- ${related}`));
        lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push(`*Last updated: ${adr.date}*`);

    return lines.join('\n');
}

/**
 * Generate ADR for API Architecture Style
 */
function generateAPIStyleADR(
    id: string,
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    return {
        id,
        title: 'API Architecture Style',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need to design an API architecture that:
- Provides clear resource-based endpoints
- Supports multiple client types (web, mobile, third-party)
- Is easy to document and version
- Has good security controls (authentication, rate limiting)
- Supports caching for performance
        `.trim(),
        decisionDrivers: [
            'Client diversity (web, mobile, IoT)',
            'API discoverability and documentation',
            'Performance requirements (latency, throughput)',
            'Security requirements (authentication, authorization)',
            'Team expertise with API paradigms'
        ],
        options: [
            {
                name: 'REST (RESTful HTTP)',
                description: 'Resource-based API using HTTP verbs',
                pros: [
                    'Industry standard, widely understood',
                    'Excellent caching support (HTTP caching)',
                    'Stateless design (scales horizontally)',
                    'Rich ecosystem of tools (Swagger/OpenAPI)',
                    'Easy to secure (OAuth2, JWT)'
                ],
                cons: [
                    'Over-fetching/under-fetching issues',
                    'Multiple round trips for complex data',
                    'Versioning can be cumbersome'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'low',
                score: 80
            },
            {
                name: 'GraphQL',
                description: 'Query language for APIs with flexible data fetching',
                pros: [
                    'Clients request exactly what they need (no over-fetching)',
                    'Single endpoint for all queries',
                    'Strong typing with schema introspection',
                    'Real-time subscriptions built-in'
                ],
                cons: [
                    'Complexity in authorization (field-level permissions)',
                    'Caching is harder (no HTTP verbs)',
                    'Query complexity attacks if not rate-limited',
                    'Steeper learning curve for team'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'medium',
                score: 65
            },
            {
                name: 'gRPC',
                description: 'High-performance RPC framework using Protocol Buffers',
                pros: [
                    'Excellent performance (binary protocol)',
                    'Strong typing with .proto schemas',
                    'Bi-directional streaming',
                    'Auto-generated client libraries'
                ],
                cons: [
                    'Not browser-friendly (requires gRPC-Web)',
                    'Harder to debug (binary format)',
                    'Less human-readable than JSON',
                    'Smaller ecosystem than REST'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'medium',
                score: 60
            }
        ],
        decision: `
**Selected: REST (RESTful HTTP)**

REST is chosen because:
1. **Industry standard** - Well-understood by all team members and third-party integrators
2. **Security maturity** - OAuth2, JWT, API keys are well-established patterns
3. **Caching** - HTTP caching (ETag, Cache-Control) improves performance
4. **Tooling** - Swagger/OpenAPI for documentation, Postman for testing
5. **Simplicity** - Lower learning curve, faster development velocity

We will follow REST best practices:
- Versioning via URL path (e.g., /api/v1/users)
- Consistent error responses (RFC 7807 Problem Details)
- HATEOAS for discoverability (optional links in responses)
- Rate limiting via middleware (X-RateLimit headers)

If performance becomes critical for specific endpoints, we can introduce GraphQL or gRPC selectively.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Fast development with well-known patterns',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'HTTP caching reduces server load',
                impactArea: 'performance',
                severity: 'medium'
            },
            {
                type: 'negative',
                description: 'Over-fetching may waste bandwidth on mobile clients',
                impactArea: 'performance',
                severity: 'low'
            },
            {
                type: 'positive',
                description: 'Easy to integrate with API gateways and WAFs',
                impactArea: 'security',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-003'],
        complianceImpact: []
    };
}

/**
 * Generate ADR for Authentication & Authorization
 */
function generateAuthADR(
    id: string,
    domain: LoadedDomain | undefined,
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    const requiresMFA = domain?.compliance?.regulations.some(r => 
        r.requirements.some(req => req.description.toLowerCase().includes('mfa') || req.description.toLowerCase().includes('multi-factor'))
    );

    return {
        id,
        title: 'Authentication & Authorization Mechanism',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need a secure authentication and authorization system that:
- Supports multiple authentication methods (password, MFA, SSO)
- Implements fine-grained authorization (RBAC)
- Is stateless for horizontal scaling
- Complies with security standards (OWASP, NIST)
${requiresMFA ? '- **MUST** support Multi-Factor Authentication (compliance requirement)' : ''}
        `.trim(),
        decisionDrivers: [
            'Security requirements (OWASP A07:2021)',
            'Compliance requirements (SOC2, ISO 27001)',
            'User experience (SSO, remember me)',
            'Scalability (stateless tokens)',
            'Auditability (who accessed what, when)'
        ],
        options: [
            {
                name: 'JWT (JSON Web Tokens) + OAuth2',
                description: 'Stateless token-based authentication with OAuth2 flows',
                pros: [
                    'Stateless - no server-side session storage',
                    'Scales horizontally easily',
                    'Industry standard (OAuth2 RFC 6749)',
                    'Self-contained tokens (claims embedded)',
                    'Supports multiple clients (web, mobile, third-party)'
                ],
                cons: [
                    'Token revocation is complex (need blacklist)',
                    'Token size can be large (embedded claims)',
                    'Secret rotation requires re-issuing all tokens',
                    'Vulnerable if signing key is compromised'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'medium',
                score: 80
            },
            {
                name: 'Session-based (Server-side sessions)',
                description: 'Traditional session cookies with server-side storage',
                pros: [
                    'Easy revocation (delete session from DB)',
                    'Smaller payload (only session ID in cookie)',
                    'Well-understood pattern',
                    'Easy to implement MFA state'
                ],
                cons: [
                    'Requires sticky sessions or centralized session store',
                    'Horizontal scaling is harder (session affinity)',
                    'Not suitable for third-party API clients',
                    'CSRF protection required'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'low',
                score: 65
            },
            {
                name: 'OpenID Connect (OIDC)',
                description: 'Identity layer on top of OAuth2 with SSO support',
                pros: [
                    'Built-in SSO (single sign-on)',
                    'Standardized user info endpoint',
                    'Federated identity (integrate with Google, Azure AD)',
                    'ID tokens + access tokens'
                ],
                cons: [
                    'Complexity of implementing full OIDC provider',
                    'Requires understanding of OAuth2 flows',
                    'External dependency if using third-party OIDC'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'medium',
                score: 70
            }
        ],
        decision: `
**Selected: JWT + OAuth2 with MFA**

JWT with OAuth2 is chosen because:
1. **Stateless scaling** - No server-side session store required
2. **Multi-client support** - Works for web, mobile, and third-party APIs
3. **Compliance-ready** - Supports MFA flows (OAuth2 grants)
4. **Industry standard** - Well-documented patterns (RFC 6749, RFC 7519)
5. **Auditability** - Claims in JWT can include user ID, roles, issued timestamp

Implementation details:
- **Access tokens**: JWT with 15-minute expiry (short-lived)
- **Refresh tokens**: Opaque tokens stored in DB with 7-day expiry (revocable)
- **MFA**: TOTP (Time-based One-Time Password) using Google Authenticator
- **Token storage**: Access token in memory (never localStorage), refresh token in HttpOnly cookie
- **Secret management**: Rotate signing keys every 90 days
- **RBAC**: Roles embedded in JWT claims (e.g., {"roles": ["admin", "user"]})

Security controls:
- ✅ Rate limiting on /auth/login (5 attempts per 15 min)
- ✅ Audit logging for all authentication events
- ✅ Refresh token rotation (issue new refresh token on each use)
- ✅ Token blacklist for logout (store revoked tokens in Redis)
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Horizontal scaling without session affinity',
                impactArea: 'scalability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'MFA support meets compliance requirements',
                impactArea: 'compliance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Token revocation requires additional infrastructure (Redis blacklist)',
                impactArea: 'cost',
                severity: 'low'
            },
            {
                type: 'negative',
                description: 'Compromised signing key affects all tokens (need rotation strategy)',
                impactArea: 'security',
                severity: 'medium'
            },
            {
                type: 'positive',
                description: 'Audit trail via JWT claims (who, when, from where)',
                impactArea: 'security',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-001', 'ADR-004'],
        complianceImpact: requiresMFA ? ['SOC2 (MFA required)', 'NIST 800-63B (authenticator assurance)'] : []
    };
}

/**
 * Generate ADR for Data Encryption Strategy
 */
function generateEncryptionADR(
    id: string,
    domain: LoadedDomain | undefined,
    constraints: ProjectConstraint[]
): ArchitectureDecision {
    return {
        id,
        title: 'Data Encryption Strategy',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need comprehensive encryption strategy for:
- Data at rest (database, file storage, backups)
- Data in transit (API calls, websockets, external integrations)
- Key management (generation, rotation, access control)

Sensitive data types identified:
${domain?.domain.sensitiveData.map(sd => `- ${sd.type} (${sd.level}): ${sd.encryption}`).join('\n') || '- PII, passwords, API keys'}
        `.trim(),
        decisionDrivers: [
            'Compliance requirements (GDPR, HIPAA, PCI-DSS)',
            'Threat model (data breach risk)',
            'Performance impact of encryption',
            'Key management complexity',
            'Recovery scenarios (key loss, disaster recovery)'
        ],
        options: [
            {
                name: 'AES-256-GCM (Application-Level Encryption)',
                description: 'Encrypt data in application before storing in database',
                pros: [
                    'Fine-grained control (encrypt specific fields)',
                    'Database compromise does not expose plaintext',
                    'Works with any database',
                    'Can use different keys per tenant/user'
                ],
                cons: [
                    'Cannot query encrypted fields (no WHERE clause)',
                    'Application must handle key management',
                    'Performance overhead (encrypt/decrypt on every read)',
                    'Complex to implement correctly'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'high',
                score: 70
            },
            {
                name: 'Database Native Encryption (TDE)',
                description: 'Use database Transparent Data Encryption',
                pros: [
                    'Transparent to application (no code changes)',
                    'Protects entire database (tables, indexes, logs)',
                    'Good performance (hardware acceleration)',
                    'Database handles key management'
                ],
                cons: [
                    'Database compromise with admin access exposes data',
                    'Less granular control (all-or-nothing)',
                    'Backup encryption depends on DB configuration',
                    'Database-specific (PostgreSQL, MySQL implementation differs)'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'medium',
                score: 75
            },
            {
                name: 'Hybrid Approach',
                description: 'TDE for database + field-level encryption for critical fields',
                pros: [
                    'Defense in depth (two layers)',
                    'TDE protects most data with low overhead',
                    'Field-level for ultra-sensitive (passwords, SSN)',
                    'Balances security and performance'
                ],
                cons: [
                    'Increased complexity',
                    'Two key management systems',
                    'Higher development cost'
                ],
                cost: 'medium',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            }
        ],
        decision: `
**Selected: Hybrid Approach (TDE + Field-Level Encryption)**

Rationale:
1. **TDE (Transparent Data Encryption)** for database-wide protection
   - Protects against physical theft, disk disposal, backup theft
   - PostgreSQL: Use pgcrypto extension + encryption at rest
   - Minimal performance impact (<5% overhead)

2. **Field-Level Encryption** (AES-256-GCM) for ultra-sensitive fields:
   - Passwords: bcrypt hashing (not encryption)
   - API keys, tokens: AES-256-GCM with per-user keys
   - PII (SSN, credit cards): AES-256-GCM with rotation

3. **Key Management**:
   - Use AWS KMS / Azure Key Vault (or HashiCorp Vault for self-hosted)
   - Master keys in HSM (Hardware Security Module)
   - Rotate data encryption keys every 90 days
   - Envelope encryption: Master key encrypts data keys

4. **Data in Transit**:
   - TLS 1.3 for all external connections (API, database)
   - Certificate rotation every 6 months
   - HSTS enabled (Strict-Transport-Security header)

Implementation:
\`\`\`typescript
// Field-level encryption example
class EncryptionService {
    async encryptField(plaintext: string, userId: string): Promise<string> {
        // STEP 1: Get user-specific data key from KMS
        const dataKey = await kms.getDataKey(userId);
        
        // STEP 2: Generate random IV (Initialization Vector)
        const iv = crypto.randomBytes(16);
        
        // STEP 3: Encrypt with AES-256-GCM (authenticated encryption)
        const cipher = crypto.createCipheriv('aes-256-gcm', dataKey, iv);
        const ciphertext = cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex');
        const authTag = cipher.getAuthTag();
        
        // STEP 4: Return: IV + AuthTag + Ciphertext (base64)
        return Buffer.from(iv + authTag + ciphertext).toString('base64');
    }
}
\`\`\`
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Defense in depth protects against multiple attack vectors',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Compliance-ready (GDPR, HIPAA, PCI-DSS)',
                impactArea: 'compliance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Increased complexity in key management',
                impactArea: 'maintainability',
                severity: 'medium'
            },
            {
                type: 'negative',
                description: 'Cannot query encrypted fields efficiently',
                impactArea: 'performance',
                severity: 'medium'
            },
            {
                type: 'positive',
                description: 'Minimizes impact of database breach',
                impactArea: 'security',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-001', 'ADR-003'],
        complianceImpact: ['GDPR Article 32', 'HIPAA 164.312(a)(2)(iv)', 'PCI-DSS 3.4']
    };
}

/**
 * Generate ADR for Caching Strategy
 */
function generateCachingADR(id: string, constraints: ProjectConstraint[]): ArchitectureDecision {
    return {
        id,
        title: 'Caching Strategy',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need a caching strategy to:
- Reduce database load (read-heavy workload)
- Improve API response times (target: <200ms p95)
- Scale horizontally without database bottlenecks
- Handle cache invalidation correctly (avoid stale data)
        `.trim(),
        decisionDrivers: [
            'Read vs write workload ratio',
            'Data freshness requirements',
            'Scalability needs',
            'Complexity of cache invalidation',
            'Cost of caching infrastructure'
        ],
        options: [
            {
                name: 'In-Memory Cache (Redis)',
                description: 'Use Redis as a distributed in-memory cache',
                pros: [
                    'Extremely fast (sub-millisecond latency)',
                    'Supports complex data structures (hashes, sets)',
                    'Built-in eviction policies (LRU, LFU)',
                    'Supports clustering for high availability'
                ],
        cons: [
                    'Additional infrastructure to manage',
                    'Data loss on restart unless persistence enabled',
                    'Cache invalidation complexity',
                    'Cost scales with memory size'
                ],
                cost: 'medium',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'Application-Level Cache (in-process)',
                description: 'Use in-memory cache within application instances',
                pros: [
                    'Simple to implement (no external dependencies)',
                    'Low latency (local memory access)',
                    'No network overhead',
                    'Cost-effective for small-scale apps'
                ],
                cons: [
                    'Not shared across instances (cache misses on scale-out)',
                    'Limited by application memory',
                    'Cache invalidation harder (per-instance)',
                    'Does not survive application restarts'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'medium',
                score: 60
            },
            {
                name: 'CDN Caching (for static assets)',
                description: 'Use Content Delivery Network for caching static assets',
                pros: [
                    'Offloads traffic from origin server',
                    'Global distribution reduces latency for users',
                    'Built-in caching and invalidation mechanisms',
                    'Cost-effective for high traffic'
                ],
                cons: [
                    'Only applicable for static content',
                    'Cache invalidation can take time (TTL-based)',
                    'Additional cost for CDN usage',
                    'Complexity in configuring caching rules'
                ],
                cost: 'medium',
                complexity: 'low',
                riskLevel: 'low',
                score: 70
            }
        ],
        decision: `
**Selected: In-Memory Cache (Redis)**
Redis is chosen because:
1. **Performance** - Sub-millisecond latency significantly improves API response times
2. **Scalability** - Distributed cache supports horizontal scaling of application instances
3. **Data Structures** - Ability to cache complex data types (e.g., user sessions, query results)
4. **Eviction Policies** - Built-in LRU eviction helps manage memory usage effectively
5. **High Availability** - Redis clustering and replication options ensure uptime
Implementation details:
- Use Redis Cluster for horizontal scaling
- Set appropriate TTLs based on data freshness requirements
- Implement cache-aside pattern for read/write operations
- Monitor cache hit/miss ratios and adjust strategies accordingly
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Significant reduction in database load',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Improved API response times',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Additional infrastructure increases operational complexity',
                impactArea: 'maintainability',
                severity: 'medium'
            },
            {
                type: 'negative',
                description: 'Potential for stale data if cache invalidation is not handled properly',
                impactArea: 'security',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-001', 'ADR-003'],
        complianceImpact: ['GDPR (data processing efficiency)', 'SOC2 (system availability)']
    };
}

/**
 * Generate ADR for Sandbox Isolation Technology (Malware Analysis)
 */
function generateSandboxADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'Sandbox Isolation Technology',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
For malware analysis platform, we need sandboxing technology that:
- Provides complete isolation (prevent host contamination)
- Supports snapshots and rollback (analyze multiple samples)
- Monitors all system calls, network traffic, file operations
- Scales to analyze thousands of samples per day
- Supports both Windows and Linux malware analysis
        `.trim(),
        decisionDrivers: [
            'Security isolation requirements',
            'Performance (analysis speed)',
            'Observability (system call tracing)',
            'Multi-OS support (Windows, Linux)',
            'Cost and resource efficiency'
        ],
        options: [
            {
                name: 'Cuckoo Sandbox',
                description: 'Open-source automated malware analysis system',
                pros: [
                    'Battle-tested, widely used in industry',
                    'Rich analysis capabilities (behavioral, network)',
                    'Supports Windows, Linux, macOS, Android',
                    'REST API for automation',
                    'Active community and plugins'
                ],
                cons: [
                    'Resource-intensive (full VMs per sample)',
                    'Complex setup and maintenance',
                    'Slower analysis compared to containerized solutions',
                    'Detection evasion by sophisticated malware'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'low',
                score: 80
            },
            {
                name: 'Firecracker (AWS)',
                description: 'Lightweight microVM manager',
                pros: [
                    'Extremely fast boot time (<125ms)',
                    'Strong isolation (KVM-based)',
                    'Minimal memory footprint (5MB per microVM)',
                    'Designed for serverless workloads',
                    'Used by AWS Lambda (battle-tested at scale)'
                ],
                cons: [
                    'Linux host only (but can run Windows guests)',
                    'Requires KVM support (nested virtualization for cloud)',
                    'Less tooling than Cuckoo',
                    'Manual instrumentation needed'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'medium',
                score: 85
            }
        ],
        decision: `
**Selected: Firecracker + Cuckoo Hybrid**

Architecture:
1. **Firecracker microVMs** for fast, isolated execution
2. **Cuckoo modules** for analysis and reporting
3. **Orchestration layer** via Kubernetes

Benefits: Fast analysis, strong isolation, cost-efficient, scalable
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Fast analysis enables high throughput',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Strong isolation prevents host contamination',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Complex setup requires DevOps expertise',
                impactArea: 'maintainability',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-007'],
        complianceImpact: ['ISO 27001 (secure processing)']
    };
}

/**
 * Generate ADR for Consensus Algorithm (Blockchain)
 */
function generateConsensusADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'Consensus Algorithm',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
For blockchain/distributed ledger system, we need consensus mechanism that:
- Ensures all nodes agree on transaction order
- Tolerates Byzantine faults (malicious nodes)
- Provides finality (transactions cannot be reversed)
- Scales to support required throughput
        `.trim(),
        decisionDrivers: [
            'Throughput requirements (transactions per second)',
            'Finality time (confirmation latency)',
            'Byzantine fault tolerance (BFT)',
            'Energy efficiency',
            'Decentralization vs performance tradeoff'
        ],
        options: [
            {
                name: 'Proof of Work (PoW)',
                description: 'Nakamoto consensus (Bitcoin, Ethereum 1.0)',
                pros: [
                    'Battle-tested (Bitcoin since 2009)',
                    'High security (51% attack very expensive)',
                    'True permissionless'
                ],
                cons: [
                    'Extremely energy-intensive',
                    'Low throughput (Bitcoin: 7 TPS)',
                    'Probabilistic finality'
                ],
                cost: 'high',
                complexity: 'low',
                riskLevel: 'low',
                score: 50
            },
            {
                name: 'Tendermint (BFT)',
                description: 'Modern BFT consensus (Cosmos, Binance Chain)',
                pros: [
                    'Instant finality (1 block = finalized)',
                    'High throughput (up to 10k TPS)',
                    'Tolerate up to 1/3 Byzantine nodes',
                    'Good developer experience'
                ],
                cons: [
                    'Requires validator set',
                    'Liveness depends on >2/3 validators online',
                    'Less decentralized than PoW'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            }
        ],
        decision: `
**Selected: Tendermint BFT**

Tendermint is chosen for instant finality, high throughput, and Byzantine fault tolerance.
Supports thousands of TPS with 5-second block time.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Instant finality improves user experience',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Energy-efficient (no mining)',
                impactArea: 'cost',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Less decentralized than PoW',
                impactArea: 'security',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-001'],
        complianceImpact: ['Financial regulations (transaction finality)']
    };
}

/**
 * Generate ADR for Logging & Monitoring Solution
 */
function generateLoggingADR(id: string, constraints: ProjectConstraint[]): ArchitectureDecision {
    return {
        id,
        title: 'Logging & Monitoring Solution',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need comprehensive observability platform that:
- Aggregates logs from all services (centralized logging)
- Monitors application performance (APM)
- Tracks business metrics and KPIs
- Provides alerting for incidents
        `.trim(),
        decisionDrivers: [
            'Log retention requirements (compliance)',
            'Query performance for troubleshooting',
            'Cost (storage and ingestion)',
            'Integration with existing tools'
        ],
        options: [
            {
                name: 'ELK Stack (Elasticsearch + Logstash + Kibana)',
                description: 'Open-source log aggregation and visualization',
                pros: [
                    'Powerful full-text search',
                    'Rich visualization',
                    'Large ecosystem',
                    'Self-hosted (data sovereignty)'
                ],
                cons: [
                    'Expensive to scale',
                    'High operational overhead',
                    'Complex query language'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'medium',
                score: 75
            },
            {
                name: 'Grafana Stack (Loki + Prometheus + Grafana)',
                description: 'Open-source observability (CNCF projects)',
                pros: [
                    'Cost-effective (label-based indexing)',
                    'Native Kubernetes integration',
                    'Unified dashboards (logs + metrics)',
                    'Open-source with commercial support'
                ],
                cons: [
                    'Less mature than ELK for log search',
                    'Limited built-in alerting',
                    'Requires multiple components'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            }
        ],
        decision: `
**Selected: Grafana Stack (Loki + Prometheus + Tempo + Grafana)**

Components: Loki (logs), Prometheus (metrics), Tempo (traces), Grafana (dashboards).
Cost-effective with unified observability.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Cost-effective log storage',
                impactArea: 'cost',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Unified observability',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Compliance audit trails',
                impactArea: 'compliance',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-007'],
        complianceImpact: ['SOC2 (audit logging)', 'GDPR (data retention)']
    };
}

/**
 * Generate ADR for Deployment Architecture
 */
function generateDeploymentADR(id: string, constraints: ProjectConstraint[]): ArchitectureDecision {
    return {
        id,
        title: 'Deployment Architecture',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need deployment architecture that:
- Supports horizontal scaling (auto-scaling)
- Provides zero-downtime deployments
- Isolates workloads for security
- Optimizes cost (resource utilization)
        `.trim(),
        decisionDrivers: [
            'Scalability requirements',
            'Availability SLA (99.9%)',
            'Security isolation',
            'Cost optimization'
        ],
        options: [
            {
                name: 'Kubernetes (K8s)',
                description: 'Container orchestration platform',
                pros: [
                    'Industry standard',
                    'Auto-scaling (HPA, VPA)',
                    'Self-healing',
                    'Multi-cloud portability'
                ],
                cons: [
                    'Steep learning curve',
                    'Complex to operate',
                    'Resource overhead'
                ],
                cost: 'medium',
                complexity: 'high',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'Serverless (AWS Lambda)',
                description: 'Function-as-a-Service',
                pros: [
                    'True auto-scaling',
                    'Pay-per-use',
                    'Zero operational overhead'
                ],
                cons: [
                    'Cold start latency',
                    'Vendor lock-in',
                    'Limited execution time'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'medium',
                score: 70
            }
        ],
        decision: `
**Selected: Kubernetes on Cloud Provider (AWS EKS / GCP GKE / Azure AKS)**

Multi-AZ cluster with auto-scaling, GitOps deployments via ArgoCD.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Auto-scaling ensures high availability',
                impactArea: 'scalability',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Complex to learn and operate',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Strong security isolation',
                impactArea: 'security',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-006'],
        complianceImpact: ['SOC2 (infrastructure controls)']
    };
}

/**
 * Generate ADR for Error Handling & Resilience Patterns
 */
function generateErrorHandlingADR(id: string, constraints: ProjectConstraint[]): ArchitectureDecision {
    return {
        id,
        title: 'Error Handling & Resilience Patterns',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need resilient system that:
- Gracefully handles failures
- Prevents cascading failures
- Provides clear error messages
- Enables observability
        `.trim(),
        decisionDrivers: [
            'Availability SLA (99.9%)',
            'User experience',
            'Operational burden',
            'External dependencies'
        ],
        options: [
            {
                name: 'Circuit Breaker Pattern',
                description: 'Stop calling failing service, return fallback',
                pros: [
                    'Prevents cascading failures',
                    'Fast failure',
                    'Auto-recovery'
                ],
                cons: [
                    'Requires fallback logic',
                    'Complex state machine'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'Retry with Exponential Backoff',
                description: 'Retry failed requests with increasing delay',
                pros: [
                    'Simple to implement',
                    'Handles transient failures',
                    'Industry best practice'
                ],
                cons: [
                    'Can amplify load',
                    'Idempotency required'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'low',
                score: 80
            }
        ],
        decision: `
**Selected: Multi-Layer Resilience Strategy**

Combine retry with exponential backoff, circuit breaker, and timeouts.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Prevents cascading failures',
                impactArea: 'scalability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Improves user experience',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Meets 99.9% availability SLA',
                impactArea: 'scalability',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-002', 'ADR-006'],
        complianceImpact: ['SOC2 (availability controls)']
    };
}

/**
 * Generate ADR for Model Serving Architecture (ML/AI Domain)
 */
function generateModelServingADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'Model Serving Architecture',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need to deploy machine learning models in production with:
- Low latency inference (<100ms p95)
- High throughput (1000+ requests/sec)
- Support for model versioning and A/B testing
- GPU acceleration for deep learning models
- Secure model access and API rate limiting
        `.trim(),
        decisionDrivers: [
            'Inference latency requirements (<100ms)',
            'Model size (100MB - 5GB)',
            'Request rate (1000+ QPS)',
            'GPU utilization efficiency',
            'Model update frequency'
        ],
        options: [
            {
                name: 'TensorFlow Serving',
                description: 'Production-ready model serving system',
                pros: [
                    'Native TensorFlow/Keras support',
                    'gRPC and REST API',
                    'Model versioning built-in',
                    'Batching optimization',
                    'Production-proven at Google scale'
                ],
                cons: [
                    'TensorFlow-specific',
                    'Complex configuration',
                    'Larger resource footprint'
                ],
                cost: 'medium',
                complexity: 'medium',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'TorchServe',
                description: 'PyTorch model serving framework',
                pros: [
                    'Native PyTorch support',
                    'Dynamic batching',
                    'Multi-model serving',
                    'Custom handlers',
                    'Kubernetes integration'
                ],
                cons: [
                    'PyTorch-specific',
                    'Smaller community than TF Serving',
                    'Less mature'
                ],
                cost: 'medium',
                complexity: 'medium',
                riskLevel: 'medium',
                score: 80
            },
            {
                name: 'Triton Inference Server',
                description: 'NVIDIA multi-framework serving',
                pros: [
                    'Framework-agnostic (TF, PyTorch, ONNX)',
                    'Optimized GPU utilization',
                    'Dynamic batching',
                    'Model ensemble support',
                    'Best performance for GPU workloads'
                ],
                cons: [
                    'NVIDIA ecosystem lock-in',
                    'Complex setup',
                    'GPU required'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'medium',
                score: 90
            }
        ],
        decision: `
**Selected: Triton Inference Server**

Triton chosen for framework flexibility, GPU optimization, and performance.
Supports TensorFlow, PyTorch, ONNX models. Achieves <50ms p95 latency.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Framework-agnostic architecture',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Best GPU utilization (>90%)',
                impactArea: 'cost',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Requires GPU infrastructure',
                impactArea: 'cost',
                severity: 'high'
            }
        ],
        relatedDecisions: ['ADR-001', 'ADR-007'],
        complianceImpact: ['Model governance requirements', 'AI/ML regulation compliance']
    };
}

/**
 * Generate ADR for IDS/IPS Deployment Mode (Network Security Domain)
 */
function generateIDSDeploymentADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'IDS/IPS Deployment Mode',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need to detect and prevent network intrusions with:
- Real-time threat detection
- Minimal network latency impact
- Coverage across all network segments
- Support for encrypted traffic inspection
- Integration with SIEM for incident response
        `.trim(),
        decisionDrivers: [
            'Network throughput (10Gbps)',
            'Latency tolerance (<5ms)',
            'Detection accuracy (>95% TPR, <1% FPR)',
            'Inline vs. passive monitoring',
            'Encrypted traffic analysis'
        ],
        options: [
            {
                name: 'Inline IPS with Bypass',
                description: 'IPS in network path with hardware bypass',
                pros: [
                    'Active blocking of threats',
                    'Hardware bypass on failure',
                    'Real-time protection',
                    'Meets compliance requirements',
                    'Unified detection + prevention'
                ],
                cons: [
                    'Single point of failure',
                    'Introduces latency (2-5ms)',
                    'Complex tuning to avoid false positives',
                    'Throughput bottleneck'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'medium',
                score: 85
            },
            {
                name: 'Passive IDS with SPAN/TAP',
                description: 'Out-of-band monitoring via network tap',
                pros: [
                    'Zero network latency',
                    'No availability risk',
                    'Flexible placement',
                    'Easier tuning'
                ],
                cons: [
                    'Cannot block attacks',
                    'Delayed response',
                    'Requires separate remediation',
                    'Misses inline encrypted traffic'
                ],
                cost: 'medium',
                complexity: 'low',
                riskLevel: 'high',
                score: 70
            },
            {
                name: 'Hybrid IDS/IPS',
                description: 'IDS on SPAN + IPS inline at critical points',
                pros: [
                    'Balanced approach',
                    'IPS only where needed',
                    'Broad IDS coverage',
                    'Reduced false positive impact'
                ],
                cons: [
                    'Complex architecture',
                    'Multiple tools to manage',
                    'Higher cost'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'medium',
                score: 90
            }
        ],
        decision: `
**Selected: Hybrid IDS/IPS Architecture**

Deploy IPS inline at perimeter and DMZ with hardware bypass.
Deploy IDS via SPAN ports for internal monitoring.
Use Suricata for unified engine with ET Pro rulesets.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Active protection at perimeter',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Broad visibility without latency',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Increased operational complexity',
                impactArea: 'maintainability',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-002', 'ADR-006'],
        complianceImpact: ['PCI DSS Requirement 11.4 (IDS/IPS)', 'NIST CSF (DE.CM-1)']
    };
}

/**
 * Generate ADR for WAF Architecture (Web Security Domain)
 */
function generateWAFArchitectureADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'WAF Architecture',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need a Web Application Firewall to:
- Protect against OWASP Top 10 vulnerabilities
- Block malicious bots and scrapers
- Provide rate limiting and DDoS protection
- Support custom security rules
- Minimal latency impact (<10ms p95)
        `.trim(),
        decisionDrivers: [
            'Threat coverage (OWASP Top 10)',
            'False positive rate (<0.1%)',
            'Latency impact (<10ms)',
            'Custom rule flexibility',
            'Cost at scale (10M requests/day)'
        ],
        options: [
            {
                name: 'AWS WAF',
                description: 'Managed WAF integrated with CloudFront/ALB',
                pros: [
                    'Native AWS integration',
                    'Pay-per-use pricing',
                    'Managed rule groups (OWASP)',
                    'Low latency (<5ms)',
                    'DDoS protection with Shield'
                ],
                cons: [
                    'AWS vendor lock-in',
                    'Limited advanced features',
                    'Rule complexity limitations',
                    'Cost scales with requests'
                ],
                cost: 'medium',
                complexity: 'low',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'ModSecurity (NGINX)',
                description: 'Open-source WAF module for NGINX',
                pros: [
                    'Open-source (no licensing)',
                    'Full control and customization',
                    'OWASP CRS support',
                    'Self-hosted'
                ],
                cons: [
                    'Requires operational expertise',
                    'Manual tuning needed',
                    'No managed threat intelligence',
                    'Maintenance overhead'
                ],
                cost: 'low',
                complexity: 'high',
                riskLevel: 'medium',
                score: 75
            },
            {
                name: 'Cloudflare WAF',
                description: 'Cloud-based WAF with CDN',
                pros: [
                    'Global edge deployment',
                    'DDoS protection included',
                    'Managed threat intelligence',
                    'Bot detection with ML',
                    'Best performance (<3ms)'
                ],
                cons: [
                    'Cloud vendor dependency',
                    'Limited on-premise support',
                    'Higher cost at scale',
                    'Less customization'
                ],
                cost: 'high',
                complexity: 'low',
                riskLevel: 'low',
                score: 90
            }
        ],
        decision: `
**Selected: Cloudflare WAF**

Cloudflare chosen for global edge protection, ML-based bot detection, and DDoS mitigation.
Achieves <3ms latency with 99.99% availability SLA.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Best-in-class DDoS protection',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Global edge reduces latency',
                impactArea: 'performance',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Vendor lock-in to Cloudflare',
                impactArea: 'maintainability',
                severity: 'medium'
            }
        ],
        relatedDecisions: ['ADR-002', 'ADR-003'],
        complianceImpact: ['PCI DSS Requirement 6.6 (WAF)', 'OWASP ASVS compliance']
    };
}

/**
 * Generate ADR for SAST Tool Selection (AppSec Domain)
 */
function generateSASTToolADR(id: string): ArchitectureDecision {
    return {
        id,
        title: 'SAST Tool Selection',
        status: 'accepted',
        date: new Date().toISOString().split('T')[0],
        context: `
We need static application security testing to:
- Detect vulnerabilities in source code (SQL injection, XSS, etc.)
- Integrate with CI/CD pipeline
- Support multiple languages (Java, Python, JavaScript)
- Provide actionable remediation guidance
- Low false positive rate (<10%)
        `.trim(),
        decisionDrivers: [
            'Language support (Java, Python, JS, TypeScript)',
            'Detection accuracy (>90% true positive rate)',
            'CI/CD integration',
            'Scan time (<5 minutes for medium codebase)',
            'Developer experience'
        ],
        options: [
            {
                name: 'SonarQube',
                description: 'Open-source code quality and security platform',
                pros: [
                    'Free Community Edition',
                    'Multi-language support (25+)',
                    'IDE integration',
                    'Quality gates in CI/CD',
                    'Active community'
                ],
                cons: [
                    'Limited security rules in free version',
                    'Higher false positives',
                    'Requires infrastructure',
                    'Less deep security analysis'
                ],
                cost: 'low',
                complexity: 'medium',
                riskLevel: 'medium',
                score: 75
            },
            {
                name: 'Checkmarx SAST',
                description: 'Enterprise-grade commercial SAST tool',
                pros: [
                    'Deep dataflow analysis',
                    'Low false positive rate',
                    'Comprehensive language support',
                    'Developer training modules',
                    'Compliance reporting'
                ],
                cons: [
                    'High licensing cost',
                    'Slower scan times',
                    'Complex setup',
                    'Steep learning curve'
                ],
                cost: 'high',
                complexity: 'high',
                riskLevel: 'low',
                score: 85
            },
            {
                name: 'Semgrep',
                description: 'Lightweight static analysis with custom rules',
                pros: [
                    'Fast scan times (<2 min)',
                    'Custom rule authoring',
                    'CI-native design',
                    'Free tier available',
                    'Low false positives'
                ],
                cons: [
                    'Limited inter-procedural analysis',
                    'Smaller rule library',
                    'Less enterprise features',
                    'Manual rule tuning needed'
                ],
                cost: 'low',
                complexity: 'low',
                riskLevel: 'medium',
                score: 90
            }
        ],
        decision: `
**Selected: Semgrep for CI/CD + SonarQube for Quality Gates**

Use Semgrep for fast security-focused scans in PR pipeline (<2 min).
Use SonarQube for comprehensive quality + security gates on merge.
        `.trim(),
        consequences: [
            {
                type: 'positive',
                description: 'Fast feedback loop for developers',
                impactArea: 'maintainability',
                severity: 'high'
            },
            {
                type: 'positive',
                description: 'Comprehensive coverage',
                impactArea: 'security',
                severity: 'high'
            },
            {
                type: 'negative',
                description: 'Two tools to maintain',
                impactArea: 'cost',
                severity: 'low'
            }
        ],
        relatedDecisions: ['ADR-002'],
        complianceImpact: ['OWASP SAMM (V-ST-1-A)', 'SOC2 (secure development)']
    };
}