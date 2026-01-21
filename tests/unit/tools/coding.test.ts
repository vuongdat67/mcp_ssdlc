import { describe, it, expect } from 'vitest';
import {
    analyzeCodeSecurity,
    generateCodingGuidelines,
    getSecureTemplate
} from '../../../src/tools/coding/index.js';
import { loadDomain } from '../../../src/domains/index.js';

describe('Coding Assistant Tool', () => {
    describe('analyzeCodeSecurity', () => {
        it('should detect SQL injection vulnerability', () => {
            // The regex looks for: query\s*\(.*\+.*\)|execute\s*\(.*\+
            const code = `db.query("SELECT * FROM users WHERE id = " + userId);`;

            const result = analyzeCodeSecurity(code, 'typescript');

            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i => i.title.toLowerCase().includes('sql'))).toBe(true);
        });

        it('should detect hardcoded secrets', () => {
            const code = `
                const password = "supersecret123";
                const api_key = "sk-1234567890";
            `;

            const result = analyzeCodeSecurity(code, 'typescript');

            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i =>
                i.title.toLowerCase().includes('secret') ||
                i.title.toLowerCase().includes('hardcoded')
            )).toBe(true);
        });

        it('should detect eval usage', () => {
            const code = `
                const userInput = getUserInput();
                eval(userInput);
            `;

            const result = analyzeCodeSecurity(code, 'javascript');

            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i => i.title.toLowerCase().includes('eval'))).toBe(true);
        });

        it('should detect weak crypto (MD5/SHA1)', () => {
            const code = `
                const hash = md5(password);
                const hash2 = sha1(data);
            `;

            const result = analyzeCodeSecurity(code, 'javascript');

            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i =>
                i.title.toLowerCase().includes('weak') ||
                i.title.toLowerCase().includes('hash')
            )).toBe(true);
        });

        it('should detect insecure random', async () => {
            const code = `
                const token = Math.random().toString(36);
            `;

            const domain = await loadDomain('fintech');
            const result = analyzeCodeSecurity(code, 'javascript', domain);

            expect(result.issues.some(i =>
                i.title.toLowerCase().includes('random')
            )).toBe(true);
        });

        it('should calculate security score', () => {
            const cleanCode = `
                const x = 1;
                console.log(x);
            `;

            const result = analyzeCodeSecurity(cleanCode, 'typescript');

            expect(result.score).toBeDefined();
            expect(typeof result.score).toBe('number');
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
        });

        it('should pass for clean code', () => {
            const cleanCode = `
                const x = 1;
                const y = 2;
                console.log(x + y);
            `;

            const result = analyzeCodeSecurity(cleanCode, 'typescript');

            expect(result.passed).toBe(true);
            expect(result.score).toBe(100);
        });

        it('should include CWE and OWASP references', () => {
            const code = `eval(userInput);`;

            const result = analyzeCodeSecurity(code, 'javascript');

            const evalIssue = result.issues.find(i => i.title.toLowerCase().includes('eval'));
            expect(evalIssue).toBeDefined();
            expect(evalIssue!.cwe).toBeDefined();
            expect(evalIssue!.owasp).toBeDefined();
        });

        it('should provide fix suggestions', () => {
            const code = `const password = "test123";`;

            const result = analyzeCodeSecurity(code, 'typescript');

            const secretIssue = result.issues.find(i =>
                i.title.toLowerCase().includes('secret') ||
                i.title.toLowerCase().includes('hardcoded')
            );
            expect(secretIssue).toBeDefined();
            expect(secretIssue!.fix).toBeDefined();
        });
    });

    describe('generateCodingGuidelines', () => {
        it('should generate guidelines for healthcare domain', async () => {
            const domain = await loadDomain('healthcare');
            const guidelines = generateCodingGuidelines(domain, 'typescript');

            expect(guidelines).toBeDefined();
            expect(guidelines.domain).toBe('healthcare');
            expect(guidelines.language).toBe('typescript');
        });

        it('should include security rules', async () => {
            const domain = await loadDomain('fintech');
            const guidelines = generateCodingGuidelines(domain, 'typescript');

            expect(guidelines.securityRules).toBeInstanceOf(Array);
            expect(guidelines.securityRules.length).toBeGreaterThan(0);
        });

        it('should include best practices', async () => {
            const domain = await loadDomain('generic');
            const guidelines = generateCodingGuidelines(domain, 'typescript');

            expect(guidelines.bestPractices).toBeInstanceOf(Array);
            expect(guidelines.bestPractices.length).toBeGreaterThan(0);
        });

        it('should include domain-specific patterns', async () => {
            const domain = await loadDomain('secure_comm');
            const guidelines = generateCodingGuidelines(domain, 'typescript');

            expect(guidelines.patterns).toBeInstanceOf(Array);
            // secure_comm should have Double Ratchet pattern
            expect(guidelines.patterns.some(p =>
                p.name.toLowerCase().includes('ratchet') ||
                p.when.toLowerCase().includes('encrypt')
            )).toBe(true);
        });
    });

    describe('getSecureTemplate', () => {
        it('should return authentication template', async () => {
            const feature = {
                id: 'F-001',
                name: 'authentication',
                priority: 'P0' as const,
                description: 'User authentication',
                dependencies: [],
                subFeatures: [],
                acceptanceCriteria: [],
                technicalNotes: '',
                securityConsiderations: []
            };

            const template = getSecureTemplate(feature, 'typescript');

            expect(template).toBeDefined();
            expect(template.length).toBeGreaterThan(0);
            expect(template).toContain('bcrypt');
        });

        it('should return API endpoint template', async () => {
            const feature = {
                id: 'F-002',
                name: 'api_endpoint',
                priority: 'P0' as const,
                description: 'REST API endpoint',
                dependencies: [],
                subFeatures: [],
                acceptanceCriteria: [],
                technicalNotes: '',
                securityConsiderations: []
            };

            const template = getSecureTemplate(feature, 'typescript');

            expect(template).toBeDefined();
            expect(template).toContain('zod');
            expect(template).toContain('rateLimit');
        });

        it('should return database template', async () => {
            const feature = {
                id: 'F-003',
                name: 'database',
                priority: 'P0' as const,
                description: 'Database access',
                dependencies: [],
                subFeatures: [],
                acceptanceCriteria: [],
                technicalNotes: '',
                securityConsiderations: []
            };

            const template = getSecureTemplate(feature, 'typescript');

            expect(template).toBeDefined();
            expect(template).toContain('parameterized');
        });

        it('should handle domain context', async () => {
            const feature = {
                id: 'F-001',
                name: 'user_login',
                priority: 'P0' as const,
                description: 'Login feature',
                dependencies: [],
                subFeatures: [],
                acceptanceCriteria: [],
                technicalNotes: '',
                securityConsiderations: []
            };

            const domain = await loadDomain('healthcare');
            const template = getSecureTemplate(feature, 'typescript', domain);

            expect(template).toBeDefined();
        });
    });
});
