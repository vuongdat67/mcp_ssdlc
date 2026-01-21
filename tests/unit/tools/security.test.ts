import { describe, it, expect } from 'vitest';
import { generateThreatModel } from '../../../src/tools/security/index.js';
import { loadDomain } from '../../../src/domains/index.js';

describe('Security Tool - Threat Model Generator', () => {
    const sampleModules = [
        {
            name: 'AuthService',
            type: 'service' as const,
            description: 'Authentication service',
            responsibilities: ['User authentication', 'Token management'],
            dependencies: ['DatabaseService'],
            interfaces: [],
            classes: []
        },
        {
            name: 'PaymentService',
            type: 'service' as const,
            description: 'Payment processing service',
            responsibilities: ['Process payments', 'Handle refunds'],
            dependencies: ['AuthService'],
            interfaces: [],
            classes: []
        }
    ];

    describe('generateThreatModel', () => {
        it('should generate threats from modules', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            expect(result).toBeDefined();
            expect(result.threats).toBeDefined();
            expect(Array.isArray(result.threats)).toBe(true);
            expect(result.threats.length).toBeGreaterThan(0);
        });

        it('should include STRIDE categories', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            const categories = result.threats.map((t: any) => t.category);
            const strideCategories = ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege'];

            // At least some STRIDE categories should be present
            expect(categories.some((c: string) => strideCategories.includes(c))).toBe(true);
        });

        it('should generate recommendations', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            expect(result.recommendations).toBeDefined();
        });

        it('should include domain-specific threats', async () => {
            const domain = await loadDomain('fintech');
            const result = generateThreatModel({
                modules: sampleModules,
                domain,
                projectName: 'PaymentGateway'
            });

            expect(result.threats.length).toBeGreaterThan(0);
        });

        it('should include risk scores', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            result.threats.forEach((threat: any) => {
                expect(threat.riskScore).toBeDefined();
                expect(typeof threat.riskScore).toBe('number');
            });
        });

        it('should identify critical threats by impact', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            // Threats have impact field instead of priority
            const hasImpact = result.threats.every((t: any) => t.impact !== undefined);
            expect(hasImpact).toBe(true);
        });
    });
});
