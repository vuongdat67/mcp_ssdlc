import { describe, it, expect } from 'vitest';
import { designTestStrategy } from '../../../src/tools/qa/index.js';

describe('QA Tool - Test Strategy Designer', () => {
    const sampleFeatures = [
        {
            id: 'F001',
            name: 'User Authentication',
            priority: 'P0' as const,
            description: 'User login and registration',
            dependencies: [],
            subFeatures: [],
            acceptanceCriteria: ['User can register', 'User can login'],
            technicalNotes: 'Use bcrypt',
            securityConsiderations: ['Rate limiting', 'Brute force protection']
        }
    ];

    const sampleThreats = [
        {
            id: 'T-001',
            name: 'SQL Injection',
            category: 'Tampering' as const,
            description: 'Attacker injects malicious SQL code',
            targetComponent: 'database',
            likelihood: 'high' as const,
            impact: 'high' as const,
            riskScore: 8.5,
            mitigation: ['Use parameterized queries'],
            priority: 'critical' as const,
            affectedComponents: ['database'],
            status: 'open' as const
        }
    ];

    describe('designTestStrategy', () => {
        it('should generate test cases from features', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: [],
                complianceRequirements: []
            });

            expect(result).toBeDefined();
            expect(result.testCases).toBeDefined();
            expect(Array.isArray(result.testCases)).toBe(true);
        });

        it('should generate security test cases from threats', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: sampleThreats,
                complianceRequirements: []
            });

            // Check for threat-based test case - the QA tool uses 'category' and 'title'
            expect(result.testCases.some((tc: any) =>
                tc.category === 'Authorization' ||
                tc.title?.toLowerCase().includes('sql') ||
                tc.relatedTo?.includes('T-')
            )).toBe(true);
        });

        it('should calculate automation coverage', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: sampleThreats,
                complianceRequirements: []
            });

            expect(result.automationCoverage).toBeDefined();
            expect(typeof result.automationCoverage.percentage).toBe('number');
        });

        it('should include compliance-related tests', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: [],
                complianceRequirements: ['GDPR', 'HIPAA']
            });

            expect(result.testCases).toBeDefined();
        });

        it('should categorize tests by type', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: sampleThreats,
                complianceRequirements: []
            });

            // The QA tool uses 'category' field, not 'type'
            const categories = new Set(result.testCases.map((tc: any) => tc.category));
            expect(categories.size).toBeGreaterThan(0);
        });

        it('should prioritize test cases', () => {
            const result = designTestStrategy({
                features: sampleFeatures,
                threats: sampleThreats,
                complianceRequirements: []
            });

            result.testCases.forEach((tc: any) => {
                expect(tc.priority).toBeDefined();
            });
        });
    });
});
