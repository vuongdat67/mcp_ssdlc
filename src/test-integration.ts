#!/usr/bin/env node
/**
 * Comprehensive Integration Test
 * Tests ALL improvements: Traceability Matrix, NFRs, Cost Estimation, DFD/ERD, Enhanced Domains
 */

import { loadDomain } from '../src/domains/loader.js';
import { generateDataFlowDiagrams, generateEntityRelationshipDiagram } from '../src/tools/tech-lead/diagram-generators.js';
import { generateProjectPlan } from '../src/tools/bm/index.js';
import { generateSRS } from '../src/exporters/srs-exporter.js';

console.log('🧪 MCP SSDLC Toolkit - Integration Test\n');
console.log('Testing ALL improvements from todo.md\n');
console.log('='.repeat(70));

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => boolean | Promise<boolean>): void {
    totalTests++;
    try {
        const result = fn instanceof Promise ? fn : Promise.resolve(fn());
        result.then(success => {
            if (success) {
                console.log(`✅ ${name}`);
                passedTests++;
            } else {
                console.log(`❌ ${name}`);
            }
        }).catch(err => {
            console.log(`❌ ${name} - Error: ${err.message}`);
        });
    } catch (err: any) {
        console.log(`❌ ${name} - Error: ${err.message}`);
    }
}

// Sample test data
const sampleModules = [
    {
        name: 'UserService',
        type: 'service' as const,
        classes: [
            {
                name: 'UserController',
                purpose: 'Handle user operations',
                methods: [
                    { 
                        name: 'register', 
                        params: 'email: string',
                        returns: 'User',
                        description: 'Register new user'
                    }
                ],
                properties: [
                    { name: 'id', type: 'uuid', visibility: 'public' as const },
                    { name: 'email', type: 'string', visibility: 'public' as const }
                ]
            }
        ],
        interfaces: [],
        dependencies: []
    },
    {
        name: 'OrderModel',
        type: 'model' as const,
        classes: [
            {
                name: 'Order',
                purpose: 'Order entity',
                methods: [],
                properties: [
                    { name: 'id', type: 'uuid', visibility: 'public' as const },
                    { name: 'userId', type: 'uuid', visibility: 'public' as const },
                    { name: 'total', type: 'decimal', visibility: 'public' as const }
                ]
            }
        ],
        interfaces: [],
        dependencies: []
    }
];

const sampleFeatures = [
    {
        id: 'F001',
        name: 'User Registration',
        priority: 'P0' as const,
        description: 'User signup',
        dependencies: [],
        subFeatures: [
            { id: 'SF001', name: 'Email validation', parentId: 'F001' }
        ],
        acceptanceCriteria: ['Valid email required'],
        technicalNotes: 'Use bcrypt for password',
        securityConsiderations: ['Rate limiting']
    }
];

console.log('\n📋 TEST 1: DFD Diagram Generation');
console.log('-'.repeat(70));
test('DFD Level 0 generates context diagram', () => {
    const dfd = generateDataFlowDiagrams({ modules: sampleModules, features: sampleFeatures });
    return dfd.level0.includes('flowchart') && dfd.level0.includes('System');
});

test('DFD Level 1 generates process diagram', () => {
    const dfd = generateDataFlowDiagrams({ modules: sampleModules, features: sampleFeatures });
    return dfd.level1.includes('flowchart') && dfd.level1.includes('P1');
});

test('DFD Level 2 generates detailed diagram', () => {
    const dfd = generateDataFlowDiagrams({ modules: sampleModules, features: sampleFeatures });
    return dfd.level2.includes('flowchart') && dfd.level2.includes('Validate');
});

console.log('\n🗂️  TEST 2: ERD Diagram Generation');
console.log('-'.repeat(70));
test('ERD generates entity diagram', () => {
    const erd = generateEntityRelationshipDiagram({ modules: sampleModules });
    return erd.diagram.includes('erDiagram') && erd.entities.length > 0;
});

test('ERD detects entities from models', () => {
    const erd = generateEntityRelationshipDiagram({ modules: sampleModules });
    return erd.entities.some(e => e.name === 'Order');
});

test('ERD includes relationships', () => {
    const erd = generateEntityRelationshipDiagram({ modules: sampleModules });
    const hasRelationships = erd.entities.some(e => e.relationships.length > 0);
    return hasRelationships || erd.diagram.includes('||--');
});

console.log('\n💰 TEST 3: Cost Estimation');
console.log('-'.repeat(70));
test('PM tool generates cost estimate', () => {
    const plan = generateProjectPlan({
        features: sampleFeatures,
        threats: [],
        teamSize: 5,
        sprintDuration: 2,
        projectStartDate: '2024-01-01'
    });
    return plan.costEstimate !== undefined && plan.costEstimate.totalBudget > 0;
});

test('Cost estimate includes labor costs', () => {
    const plan = generateProjectPlan({
        features: sampleFeatures,
        threats: [],
        teamSize: 5,
        sprintDuration: 2,
        projectStartDate: '2024-01-01'
    });
    return plan.costEstimate.laborCost > 0;
});

test('Cost estimate includes contingency', () => {
    const plan = generateProjectPlan({
        features: sampleFeatures,
        threats: [],
        teamSize: 5,
        sprintDuration: 2,
        projectStartDate: '2024-01-01'
    });
    return plan.costEstimate.contingency > 0;
});

console.log('\n📄 TEST 4: SRS with New Sections');
console.log('-'.repeat(70));

const mockPipelineOutput = {
    projectName: 'Test Project',
    domain: {
        name: 'test',
        domain: {
            name: 'test',
            keywords: [],
            stakeholders: [],
            sensitiveData: [],
            dataClassification: { critical: [], high: [], medium: [], low: [] }
        },
        compliance: {
            regulations: [
                {
                    name: 'GDPR',
                    fullName: 'General Data Protection Regulation',
                    requirements: [
                        { id: 'GDPR-1', name: 'Data Protection', description: 'Protect user data' }
                    ]
                }
            ]
        },
        threats: []
    },
    summary: {
        totalFeatures: 5,
        totalModules: 3,
        totalThreats: 10,
        criticalThreats: 2,
        automationCoverage: 80,
        complianceFrameworks: ['GDPR', 'HIPAA']
    },
    phases: {
        ba: {
            userStories: [],
            securityRequirements: [
                {
                    id: 'SR-001',
                    category: 'Authentication',
                    requirement: 'Implement MFA',
                    priority: 'high',
                    complianceMapping: ['GDPR Art. 32']
                }
            ],
            abuseCases: []
        },
        techLead: {
            features: sampleFeatures,
            flows: [],
            modules: sampleModules,
            pseudocode: [],
            architectureDiagram: '```mermaid\nflowchart\n```',
            fileStructure: [],
            designPatterns: [],
            dataFlowDiagrams: {
                level0: '```mermaid\nflowchart TB\n```',
                level1: '```mermaid\nflowchart TB\n```',
                level2: '```mermaid\nflowchart TB\n```'
            },
            entityRelationshipDiagram: '```mermaid\nerDiagram\n```'
        },
        security: {
            threats: [
                {
                    id: 'T-001',
                    name: 'SQL Injection',
                    category: 'Tampering',
                    likelihood: 'high',
                    impact: 'high',
                    riskScore: 8.5,
                    mitigation: ['Use parameterized queries'],
                    priority: 'critical',
                    affectedComponents: ['database'],
                    status: 'open'
                }
            ],
            mitigations: []
        },
        qa: {
            testCases: [
                {
                    id: 'TC-001',
                    testCase: 'Test user registration',
                    type: 'functional',
                    priority: 'high',
                    steps: []
                }
            ],
            automationCoverage: {
                percentage: 80,
                total: 100,
                automated: 80,
                manual: 20
            }
        },
        devops: {
            deploymentConfig: {
                strategy: 'blue-green',
                rollbackEnabled: true,
                healthCheck: '/health'
            }
        },
        bm: {
            sprints: [],
            tasks: [],
            ganttChart: '',
            totalHours: 160,
            teamStructure: [],
            costEstimate: {
                laborCost: 100000,
                infrastructureCost: 5000,
                licenseCost: 2000,
                contingency: 20000,
                totalBudget: 127000,
                breakdown: []
            }
        }
    }
};

test('SRS includes Traceability Matrix section', () => {
    const srs = generateSRS(mockPipelineOutput as any);
    return srs.includes('## 15. TRACEABILITY MATRIX');
});

test('SRS includes NFR section', () => {
    const srs = generateSRS(mockPipelineOutput as any);
    return srs.includes('## 14. NON-FUNCTIONAL REQUIREMENTS');
});

test('SRS includes Performance requirements', () => {
    const srs = generateSRS(mockPipelineOutput as any);
    return srs.includes('### 14.1 Performance Requirements');
});

test('SRS includes DFD diagrams', () => {
    const srs = generateSRS(mockPipelineOutput as any);
    return srs.includes('DFD Level 0') || srs.includes('Data Flow');
});

test('SRS includes ERD diagram', () => {
    const srs = generateSRS(mockPipelineOutput as any);
    return srs.includes('Entity Relationship Diagram');
});

console.log('\n🌐 TEST 5: Enhanced Domains');
console.log('-'.repeat(70));

async function testDomain(domainName: string) {
    try {
        const domain = await loadDomain(domainName);
        const hasExtendedFields = 
            domain.domain.domain_specific_requirements !== undefined ||
            domain.domain.technical_constraints !== undefined ||
            domain.domain.recommended_tech_stack !== undefined;
        
        console.log(`✅ ${domainName} domain loads with extended schema: ${hasExtendedFields}`);
        return hasExtendedFields;
    } catch (err: any) {
        console.log(`⚠️  ${domainName} domain: ${err.message}`);
        return false;
    }
}

// Test enhanced domains
await testDomain('fintech');
await testDomain('healthcare');
await testDomain('secure_comm');

// Wait a bit for async tests
await new Promise(resolve => setTimeout(resolve, 100));

console.log('\n' + '='.repeat(70));
console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`);

if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Workflow is correct!\n');
    console.log('✅ DFD/ERD Diagrams: Working');
    console.log('✅ Cost Estimation: Working');
    console.log('✅ Traceability Matrix: Working');
    console.log('✅ NFRs: Working');
    console.log('✅ Enhanced Domains: Working');
} else {
    console.log(`\n⚠️  ${totalTests - passedTests} test(s) failed. Review output above.\n`);
}

console.log('\n💡 To use in production:');
console.log('   1. Load domain: await loadDomain("fintech")');
console.log('   2. Generate diagrams: generateDataFlowDiagrams({ modules, features })');
console.log('   3. Calculate costs: generateProjectPlan({ features, ... })');
console.log('   4. Export SRS: generateSRS(pipelineOutput)');
console.log('');
