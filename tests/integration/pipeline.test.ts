import { describe, it, expect } from 'vitest';
import { orchestratePipeline } from '../../src/orchestrator/index.js';

describe('Pipeline Orchestrator', () => {
    describe('orchestratePipeline', () => {
        it('should run full SSDLC pipeline', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Simple e-commerce platform',
                businessGoals: ['Enable online purchases', 'Secure payments'],
                techStack: ['Node.js', 'PostgreSQL'],
                targetLanguage: 'typescript',
                deploymentTarget: 'kubernetes',
                complianceRequirements: ['GDPR']
            });

            expect(result).toBeDefined();
            expect(result.projectName).toBeDefined();
            expect(result.phases).toBeDefined();
        });

        it('should detect domain automatically', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Patient health records management with HIPAA compliance',
                businessGoals: ['Secure PHI storage'],
                techStack: ['Python', 'PostgreSQL'],
                targetLanguage: 'python'
            });

            expect(result.domain.name).toBe('healthcare');
        });

        it('should include BA phase output', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Payment gateway system',
                businessGoals: ['Process payments'],
                techStack: ['Node.js'],
                targetLanguage: 'typescript'
            });

            expect(result.phases.ba).toBeDefined();
            expect(result.phases.ba.userStories).toBeDefined();
            expect(result.phases.ba.securityRequirements).toBeDefined();
        });

        it('should include Tech Lead phase output', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'API Gateway',
                businessGoals: ['Route API requests'],
                techStack: ['Go'],
                targetLanguage: 'go'
            });

            expect(result.phases.techLead).toBeDefined();
            expect(result.phases.techLead.modules).toBeDefined();
            expect(result.phases.techLead.pseudocode).toBeDefined();
        });

        it('should include Security phase output', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Authentication service',
                businessGoals: ['Secure authentication'],
                techStack: ['Node.js'],
                targetLanguage: 'typescript'
            });

            expect(result.phases.security).toBeDefined();
            expect(result.phases.security.threats).toBeDefined();
        });

        it('should include QA phase output', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Testing platform',
                businessGoals: ['Automated testing'],
                techStack: ['Python'],
                targetLanguage: 'python'
            });

            expect(result.phases.qa).toBeDefined();
            expect(result.phases.qa.testCases).toBeDefined();
        });

        it('should include DevOps phase output', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'Microservices platform',
                businessGoals: ['Deploy microservices'],
                techStack: ['Node.js', 'Docker'],
                targetLanguage: 'typescript',
                deploymentTarget: 'kubernetes'
            });

            expect(result.phases.devops).toBeDefined();
        });

        it('should generate project summary', async () => {
            const result = await orchestratePipeline({
                projectDescription: 'E-commerce platform',
                businessGoals: ['Online sales'],
                techStack: ['Node.js'],
                targetLanguage: 'typescript'
            });

            expect(result.summary).toBeDefined();
            expect(result.summary.totalFeatures).toBeDefined();
            expect(result.summary.totalModules).toBeDefined();
            expect(result.summary.totalThreats).toBeDefined();
        });
    });
});
