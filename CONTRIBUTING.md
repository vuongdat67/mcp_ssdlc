# Contributing to MCP SSDLC Security Toolkit

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Please be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/vuongdat67/mcp_ssdlc/issues) first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version)

### Suggesting Features

1. Open a [GitHub Discussion](https://github.com/vuongdat67/mcp_ssdlc/discussions)
2. Describe the use case and proposed solution
3. Wait for community feedback before implementing

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write/update tests
5. Run tests: `pnpm test`
6. Commit with conventional commits: `feat: add new feature`
7. Push and create a Pull Request

## Development Setup

### Prerequisites

- Node.js v18+
- pnpm v8+
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mcp_ssdlc
cd mcp-ssdlc-security-toolkit

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run in development mode
pnpm dev
```

## Project Structure

```
mcp-ssdlc-security-toolkit/
├── src/                    # Source code
│   ├── index.ts           # MCP server entry point
│   ├── domains/           # Domain loader
│   ├── tools/             # Tool implementations
│   │   ├── ba/           # Business Analysis
│   │   ├── tech-lead/    # Technical Design
│   │   ├── security/     # Threat Modeling
│   │   ├── qa/           # Test Strategy
│   │   ├── devops/       # CI/CD Design
│   │   ├── architecture/ # ADR Generator
│   │   └── bm/           # Project Management
│   ├── orchestrator/      # Pipeline orchestration
│   ├── exporters/         # Output formatters
│   └── types/             # TypeScript types
├── domains/               # Domain definitions
├── tests/                 # Test files
├── docs/                  # Documentation
└── .github/               # GitHub workflows
```

## Coding Standards

### TypeScript

- Use strict mode
- Define types explicitly
- Use `interface` for objects, `type` for unions
- Document public functions with JSDoc

```typescript
/**
 * Generate threat model from modules
 * @param input - Threat model input configuration
 * @returns STRIDE-based threat analysis
 */
export function generateThreatModel(input: ThreatModelInput): ThreatModelOutput {
    // Implementation
}
```

### Testing

- Write tests for new features
- Maintain >80% coverage for critical paths
- Use descriptive test names

```typescript
describe('generateThreatModel', () => {
    it('should identify SQL injection threats for database modules', () => {
        // Test implementation
    });
});
```

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):

```
feat: add blockchain domain support
fix: correct HIPAA requirement mapping
docs: update API reference
test: add security tool tests
refactor: simplify domain loader
```

## Areas for Contribution

### High Priority

- [ ] Additional domain plugins
- [ ] Improved pseudocode generation
- [ ] More compliance frameworks
- [ ] Better threat intelligence

### Medium Priority

- [ ] CLI interface
- [ ] Web dashboard
- [ ] Export to Confluence/Notion
- [ ] i18n support

### Good First Issues

Look for issues labeled `good-first-issue` on GitHub.

## Pull Request Process

1. **Branch naming**: `feature/`, `fix/`, `docs/`
2. **Title**: Clear, descriptive summary
3. **Description**: What, why, and how
4. **Tests**: Include relevant tests
5. **Documentation**: Update if needed
6. **Review**: Address feedback promptly

## Review Criteria

- Code quality and readability
- Test coverage
- Documentation updates
- Security considerations
- Performance impact

## Getting Help

- Open a [Discussion](https://github.com/vuongdat67/mcp_ssdlc/discussions)
- Check existing issues and PRs
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
