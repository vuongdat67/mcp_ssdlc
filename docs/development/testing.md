# Testing Guide

This guide covers the testing approach for the MCP SSDLC Security Toolkit.

## Test Framework

We use **Vitest** for testing:
- Fast execution with native ESM support
- Jest-compatible API
- Built-in TypeScript support
- Coverage reporting

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test -- tests/unit/tools/security.test.ts

# Run tests matching pattern
pnpm test -- -t "threat model"
```

## Test Structure

```
tests/
├── setup.ts                          # Global test setup
├── unit/                             # Unit tests
│   ├── domains/
│   │   └── loader.test.ts           # Domain loader tests
│   ├── tools/
│   │   ├── ba.test.ts               # BA tool tests
│   │   ├── tech-lead.test.ts        # Tech Lead tests
│   │   ├── security.test.ts         # Security tool tests
│   │   ├── qa.test.ts               # QA tool tests
│   │   ├── devops.test.ts           # DevOps tool tests
│   │   └── architecture.test.ts      # Architecture tests
│   └── exporters/
│       └── srs-exporter.test.ts     # SRS exporter tests
└── integration/
    └── pipeline.test.ts              # Full pipeline tests
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { generateThreatModel } from '../../../src/tools/security/index.js';

describe('Security Tool - Threat Model Generator', () => {
    const sampleModules = [
        {
            name: 'AuthService',
            type: 'service' as const,
            responsibilities: ['User authentication']
        }
    ];

    describe('generateThreatModel', () => {
        it('should generate threats from modules', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            expect(result).toBeDefined();
            expect(result.threats).toBeInstanceOf(Array);
            expect(result.threats.length).toBeGreaterThan(0);
        });

        it('should include STRIDE categories', () => {
            const result = generateThreatModel({
                modules: sampleModules,
                projectName: 'TestProject'
            });

            const categories = result.threats.map(t => t.category);
            expect(categories).toContain('Spoofing');
        });
    });
});
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { orchestratePipeline } from '../../src/orchestrator/index.js';

describe('Pipeline Orchestrator', () => {
    it('should run full SSDLC pipeline', async () => {
        const result = await orchestratePipeline({
            projectDescription: 'E-commerce platform',
            businessGoals: ['Online sales'],
            techStack: ['Node.js']
        });

        expect(result.phases.ba).toBeDefined();
        expect(result.phases.techLead).toBeDefined();
        expect(result.phases.security).toBeDefined();
        expect(result.phases.qa).toBeDefined();
        expect(result.phases.devops).toBeDefined();
    });
});
```

## Test Patterns

### Testing Async Functions

```typescript
it('should load domain asynchronously', async () => {
    const domain = await loadDomain('healthcare');
    expect(domain.domain.name).toBe('healthcare');
});
```

### Testing Errors

```typescript
it('should throw for invalid domain', async () => {
    await expect(loadDomain('invalid')).rejects.toThrow();
});
```

### Testing with Domain Context

```typescript
it('should include domain-specific threats', async () => {
    const domain = await loadDomain('fintech');
    const result = generateThreatModel({
        modules: sampleModules,
        domain,
        projectName: 'PaymentGateway'
    });

    expect(result.threats.length).toBeGreaterThan(0);
});
```

## Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Domain Loader | 90% |
| Tool Modules | 80% |
| Orchestrator | 75% |
| Exporters | 70% |

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests independent**
4. **Mock external dependencies**
5. **Test edge cases**
6. **Maintain test data separately**

## CI Integration

Tests run automatically in GitHub Actions:
- On push to `main` and `develop`
- On pull requests
- With Node.js 18, 20, and 22

## Debugging Tests

```bash
# Run with verbose output
pnpm test -- --reporter=verbose

# Run single test with debugging
node --inspect-brk node_modules/.bin/vitest --run tests/unit/tools/security.test.ts
```
