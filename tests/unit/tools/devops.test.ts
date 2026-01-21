import { describe, it, expect } from 'vitest';
import { designCICD } from '../../../src/tools/devops/index.js';

describe('DevOps Tool - CI/CD Designer', () => {
    describe('designCICD', () => {
        it('should generate pipeline stages', () => {
            const result = designCICD({
                projectName: 'TestProject',
                techStack: ['Node.js', 'PostgreSQL'],
                deploymentTarget: 'kubernetes',
                repositoryPlatform: 'github'
            });

            expect(result).toBeDefined();
            expect(result.pipelineStages).toBeDefined();
            expect(Array.isArray(result.pipelineStages)).toBe(true);
        });

        it('should include security gates', () => {
            const result = designCICD({
                projectName: 'SecureApp',
                techStack: ['TypeScript', 'PostgreSQL'],
                deploymentTarget: 'aws',
                repositoryPlatform: 'github'
            });

            expect(result.securityGates).toBeDefined();
            expect(Array.isArray(result.securityGates)).toBe(true);
        });

        it('should support different deployment targets', () => {
            const targets = ['kubernetes', 'aws', 'azure', 'gcp', 'docker'] as const;

            for (const target of targets) {
                const result = designCICD({
                    projectName: 'TestProject',
                    techStack: ['Node.js'],
                    deploymentTarget: target,
                    repositoryPlatform: 'github'
                });

                expect(result.deploymentConfig).toBeDefined();
            }
        });

        it('should support different repository platforms', () => {
            const platforms = ['github', 'gitlab', 'bitbucket'] as const;

            for (const platform of platforms) {
                const result = designCICD({
                    projectName: 'TestProject',
                    techStack: ['Node.js'],
                    deploymentTarget: 'kubernetes',
                    repositoryPlatform: platform
                });

                expect(result).toBeDefined();
            }
        });

        it('should generate deployment configuration', () => {
            const result = designCICD({
                projectName: 'TestProject',
                techStack: ['Node.js', 'Redis'],
                deploymentTarget: 'kubernetes',
                repositoryPlatform: 'github'
            });

            expect(result.deploymentConfig).toBeDefined();
        });

        it('should include SAST/DAST gates', () => {
            const result = designCICD({
                projectName: 'SecureApp',
                techStack: ['Python', 'PostgreSQL'],
                deploymentTarget: 'aws',
                repositoryPlatform: 'github'
            });

            const gateNames = result.securityGates.map((g: any) =>
                g.name?.toLowerCase() || g.toLowerCase()
            );

            // Should include some form of security scanning
            expect(gateNames.some((name: string) =>
                name.includes('sast') ||
                name.includes('dast') ||
                name.includes('security') ||
                name.includes('scan')
            )).toBe(true);
        });
    });
});
