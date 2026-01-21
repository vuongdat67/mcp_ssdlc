import { describe, it, expect } from 'vitest';
import { analyzeRequirements } from '../../../src/tools/ba/index.js';
import { loadDomain } from '../../../src/domains/index.js';

describe('BA Tool - Requirements Analyzer', () => {
    describe('analyzeRequirements', () => {
        it('should generate user stories from project description', async () => {
            const domain = await loadDomain('generic');
            const result = analyzeRequirements({
                projectDescription: 'E-commerce platform with user authentication',
                businessGoals: ['Enable online purchases', 'Secure user accounts'],
                domain
            });

            expect(result).toBeDefined();
            expect(result.userStories).toBeDefined();
            expect(Array.isArray(result.userStories)).toBe(true);
            expect(result.userStories.length).toBeGreaterThan(0);
        });

        it('should generate security requirements', async () => {
            const domain = await loadDomain('fintech');
            const result = analyzeRequirements({
                projectDescription: 'Payment processing system',
                businessGoals: ['Process payments securely'],
                domain
            });

            expect(result.securityRequirements).toBeDefined();
            expect(Array.isArray(result.securityRequirements)).toBe(true);
        });

        it('should generate abuse cases', async () => {
            const domain = await loadDomain('healthcare');
            const result = analyzeRequirements({
                projectDescription: 'Patient records management',
                businessGoals: ['Manage patient data securely'],
                domain
            });

            expect(result.abuseCases).toBeDefined();
            expect(Array.isArray(result.abuseCases)).toBe(true);
        });

        it('should include domain-specific requirements for healthcare', async () => {
            const domain = await loadDomain('healthcare');
            const result = analyzeRequirements({
                projectDescription: 'HIPAA-compliant health system',
                businessGoals: ['Store PHI securely'],
                domain
            });

            expect(result.securityRequirements.some(
                (req: any) => req.category?.toLowerCase().includes('authentication') ||
                    req.requirement?.toLowerCase().includes('hipaa')
            )).toBe(true);
        });

        it('should include domain-specific requirements for fintech', async () => {
            const domain = await loadDomain('fintech');
            const result = analyzeRequirements({
                projectDescription: 'PCI-DSS compliant payment gateway',
                businessGoals: ['Process credit card payments'],
                domain
            });

            expect(result.securityRequirements).toBeDefined();
            expect(result.securityRequirements.length).toBeGreaterThan(0);
        });
    });
});
