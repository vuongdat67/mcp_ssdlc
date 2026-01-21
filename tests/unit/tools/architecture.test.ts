import { describe, it, expect } from 'vitest';
import { generateADRs, exportADRAsMarkdown } from '../../../src/tools/architecture/adr-generator.js';
import { loadDomain } from '../../../src/domains/index.js';

describe('Architecture Tool - ADR Generator', () => {
    const sampleModules = [
        {
            name: 'UserService',
            type: 'service' as const,
            description: 'User management service',
            responsibilities: ['User CRUD', 'Authentication'],
            dependencies: ['DatabaseService'],
            interfaces: [],
            classes: []
        }
    ];

    describe('generateADRs', () => {
        it('should generate ADRs from modules', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            expect(result).toBeDefined();
            expect(result.decisions).toBeDefined();
            expect(Array.isArray(result.decisions)).toBe(true);
            expect(result.decisions.length).toBeGreaterThan(0);
        });

        it('should include decision options', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            result.decisions.forEach((adr: any) => {
                expect(adr.options).toBeDefined();
                expect(Array.isArray(adr.options)).toBe(true);
            });
        });

        it('should include consequences', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            result.decisions.forEach((adr: any) => {
                expect(adr.consequences).toBeDefined();
            });
        });

        it('should identify key decision areas', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            expect(result.summary.keyDecisionAreas).toBeDefined();
            expect(Array.isArray(result.summary.keyDecisionAreas)).toBe(true);
        });

        it('should identify high-risk decisions', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            expect(result.summary.highRiskDecisions).toBeDefined();
            expect(Array.isArray(result.summary.highRiskDecisions)).toBe(true);
        });

        it('should include tradeoff analysis', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            expect(result.tradeoffAnalysis).toBeDefined();
            expect(result.tradeoffAnalysis.dimensions).toBeDefined();
        });

        it('should include domain-specific ADRs for secure_comm', async () => {
            const domain = await loadDomain('secure_comm');
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Rust', 'PostgreSQL'],
                projectName: 'SecureChat',
                domain,
                constraints: []
            });

            const hasE2EE = result.decisions.some((d: any) =>
                d.title.toLowerCase().includes('encryption') ||
                d.title.toLowerCase().includes('e2ee')
            );
            expect(hasE2EE).toBe(true);
        });

        it('should include domain-specific ADRs for blockchain', async () => {
            const domain = await loadDomain('blockchain');
            const result = generateADRs({
                modules: [{ ...sampleModules[0], name: 'ConsensusEngine' }],
                techStack: ['Go', 'PostgreSQL'],
                projectName: 'BlockchainPlatform',
                domain,
                constraints: []
            });

            const hasConsensus = result.decisions.some((d: any) =>
                d.title.toLowerCase().includes('consensus')
            );
            expect(hasConsensus).toBe(true);
        });
    });

    describe('exportADRAsMarkdown', () => {
        it('should export ADR as markdown', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            const markdown = exportADRAsMarkdown(result.decisions[0]);

            expect(markdown).toBeDefined();
            expect(typeof markdown).toBe('string');
            expect(markdown.length).toBeGreaterThan(0);
        });

        it('should include required ADR sections', () => {
            const result = generateADRs({
                modules: sampleModules,
                techStack: ['Node.js', 'PostgreSQL'],
                projectName: 'TestProject',
                constraints: []
            });

            const markdown = exportADRAsMarkdown(result.decisions[0]);

            expect(markdown).toContain('Context');
            expect(markdown).toContain('Decision');
        });
    });
});
