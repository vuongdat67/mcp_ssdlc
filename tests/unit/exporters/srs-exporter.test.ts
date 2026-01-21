import { describe, it, expect } from 'vitest';
import { generateSRS } from '../../../src/exporters/srs-exporter.js';
import type { PipelineOutput } from '../../../src/orchestrator/index.js';

describe('SRS Exporter', () => {
    const mockPipelineOutput: Partial<PipelineOutput> = {
        projectName: 'Test Project',
        domain: {
            name: 'generic',
            domain: {
                name: 'generic',
                keywords: [],
                stakeholders: [],
                sensitiveData: [],
                dataClassification: { critical: [], high: [], medium: [], low: [] }
            },
            compliance: {
                regulations: []
            },
            threats: []
        },
        targetLanguage: 'typescript',
        summary: {
            totalFeatures: 5,
            totalModules: 3,
            totalThreats: 10,
            criticalThreats: 2,
            automationCoverage: 80,
            complianceFrameworks: ['GDPR']
        },
        phases: {
            ba: {
                userStories: [],
                securityRequirements: [],
                abuseCases: []
            },
            techLead: {
                features: [],
                flows: [],
                modules: [],
                pseudocode: [],
                architectureDiagram: '```mermaid\nflowchart TB\n```',
                fileStructure: [],
                designPatterns: []
            },
            security: {
                threats: [],
                mitigations: []
            },
            qa: {
                testCases: [],
                penetrationTestPlan: [
                    {
                        phase: 'Reconnaissance',
                        duration: '2 days',
                        activities: ['OSINT gathering', 'Network enumeration']
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
                pipelineStages: [
                    {
                        order: 1,
                        name: 'Build',
                        jobs: [
                            {
                                name: 'Compile',
                                commands: ['npm run build']
                            }
                        ]
                    }
                ],
                securityGates: [
                    {
                        name: 'SAST',
                        tool: 'Semgrep',
                        failCondition: 'High severity findings'
                    }
                ],
                deploymentConfig: {
                    strategy: 'blue-green',
                    rollbackEnabled: true,
                    healthCheck: '/health'
                }
            }
        }
    };

    describe('generateSRS', () => {
        it('should generate SRS document', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs).toBeDefined();
            expect(typeof srs).toBe('string');
            expect(srs.length).toBeGreaterThan(0);
        });

        it('should include project name', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs).toContain('Test Project');
        });

        it('should include table of contents', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs).toContain('TABLE OF CONTENTS');
        });

        it('should include security requirements section', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs.toLowerCase()).toContain('security');
        });

        it('should include architecture section', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs.toLowerCase()).toContain('architecture');
        });

        it('should include NFR section', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs).toContain('NON-FUNCTIONAL REQUIREMENTS');
        });

        it('should include traceability matrix', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            expect(srs).toContain('TRACEABILITY MATRIX');
        });

        it('should be valid markdown', () => {
            const srs = generateSRS(mockPipelineOutput as PipelineOutput);

            // Check for common markdown elements
            expect(srs).toContain('#');
            expect(srs).toContain('##');
        });
    });
});
