import { describe, it, expect } from 'vitest';
import { loadDomain, loadDomainAuto, listDomains } from '../../../src/domains/index.js';

describe('Domain Loader', () => {
    describe('listDomains', () => {
        it('should return array of available domains', () => {
            const domains = listDomains();
            expect(Array.isArray(domains)).toBe(true);
            expect(domains.length).toBeGreaterThan(0);
        });

        it('should include core domains', () => {
            const domains = listDomains();
            expect(domains).toContain('healthcare');
            expect(domains).toContain('fintech');
            expect(domains).toContain('generic');
        });

        it('should include security domains', () => {
            const domains = listDomains();
            expect(domains).toContain('appsec');
            expect(domains).toContain('networksec');
            expect(domains).toContain('websec');
        });
    });

    describe('loadDomain', () => {
        it('should load healthcare domain', async () => {
            const domain = await loadDomain('healthcare');
            expect(domain).toBeDefined();
            expect(domain.domain.name).toBe('healthcare');
        });

        it('should load fintech domain', async () => {
            const domain = await loadDomain('fintech');
            expect(domain).toBeDefined();
            expect(domain.domain.name).toBe('fintech');
        });

        it('should load secure_comm domain', async () => {
            const domain = await loadDomain('secure_comm');
            expect(domain).toBeDefined();
            expect(domain.domain.name).toBe('secure_comm');
        });

        it('should load blockchain domain', async () => {
            const domain = await loadDomain('blockchain');
            expect(domain).toBeDefined();
            expect(domain.domain.name).toBe('blockchain');
        });

        it('should include compliance data when available', async () => {
            const domain = await loadDomain('healthcare');
            expect(domain.compliance).toBeDefined();
            expect(domain.compliance?.regulations).toBeDefined();
        });

        it('should include threats data when available', async () => {
            const domain = await loadDomain('fintech');
            expect(domain.threats).toBeDefined();
        });

        it('should throw error for invalid domain', async () => {
            await expect(loadDomain('nonexistent')).rejects.toThrow();
        });
    });

    describe('loadDomainAuto', () => {
        it('should detect healthcare domain from description', async () => {
            const domain = await loadDomainAuto('Patient health records management system with HIPAA compliance');
            expect(domain.domain.name).toBe('healthcare');
        });

        it('should detect fintech domain from description', async () => {
            const domain = await loadDomainAuto('Payment processing system with PCI-DSS compliance');
            expect(domain.domain.name).toBe('fintech');
        });

        it('should detect secure_comm domain from description', async () => {
            const domain = await loadDomainAuto('End-to-end encrypted messaging with Signal Protocol');
            expect(domain.domain.name).toBe('secure_comm');
        });

        it('should detect blockchain domain from description', async () => {
            const domain = await loadDomainAuto('Decentralized blockchain with smart contracts');
            expect(domain.domain.name).toBe('blockchain');
        });

        it('should fallback to generic for unknown descriptions', async () => {
            const domain = await loadDomainAuto('Simple todo application');
            expect(domain.domain.name).toBe('generic');
        });
    });
});
