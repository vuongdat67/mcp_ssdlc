import { describe, it, expect } from 'vitest';
import { techLeadDesign } from '../../../src/tools/tech-lead/index.js';
import type { UserStory } from '../../../src/tools/tech-lead/index.js';

describe('Tech Lead Tool', () => {
    const sampleUserStories: UserStory[] = [
        {
            id: 'US-001',
            title: 'User Registration',
            asA: 'new user',
            iWant: 'to register an account',
            soThat: 'I can access the platform',
            priority: 'high'
        },
        {
            id: 'US-002',
            title: 'User Login',
            asA: 'registered user',
            iWant: 'to login securely',
            soThat: 'I can access my account',
            priority: 'high'
        }
    ];

    describe('techLeadDesign', () => {
        it('should generate features from user stories', async () => {
            const result = await techLeadDesign({
                userStories: sampleUserStories,
                securityRequirements: ['Implement MFA'],
                targetLanguage: 'typescript',
                projectName: 'TestProject'
            });

            expect(result).toBeDefined();
            expect(result.features).toBeDefined();
            expect(Array.isArray(result.features)).toBe(true);
        });

        it('should generate modules', async () => {
            const result = await techLeadDesign({
                userStories: sampleUserStories,
                securityRequirements: [],
                targetLanguage: 'python',
                projectName: 'TestProject'
            });

            expect(result.modules).toBeDefined();
            expect(Array.isArray(result.modules)).toBe(true);
        });

        it('should generate pseudocode', async () => {
            const result = await techLeadDesign({
                userStories: sampleUserStories,
                securityRequirements: [],
                targetLanguage: 'python',
                projectName: 'TestProject'
            });

            expect(result.pseudocode).toBeDefined();
            expect(Array.isArray(result.pseudocode)).toBe(true);
        });

        it('should generate architecture diagram', async () => {
            const result = await techLeadDesign({
                userStories: sampleUserStories,
                securityRequirements: [],
                targetLanguage: 'typescript',
                projectName: 'TestProject'
            });

            expect(result.architectureDiagram).toBeDefined();
            expect(result.architectureDiagram).toContain('mermaid');
        });

        it('should support multiple languages', async () => {
            const languages = ['python', 'typescript', 'java', 'go', 'csharp'] as const;

            for (const lang of languages) {
                const result = await techLeadDesign({
                    userStories: sampleUserStories,
                    securityRequirements: [],
                    targetLanguage: lang,
                    projectName: 'TestProject'
                });

                expect(result.pseudocode).toBeDefined();
            }
        });

        it('should generate flows', async () => {
            const result = await techLeadDesign({
                userStories: sampleUserStories,
                securityRequirements: ['Implement rate limiting'],
                targetLanguage: 'typescript',
                projectName: 'TestProject'
            });

            expect(result.flows).toBeDefined();
            expect(Array.isArray(result.flows)).toBe(true);
        });
    });
});
