import type { PipelineOutput } from '../orchestrator/index.js';

/**
 * Generate Professional Software Requirements Specification (SRS)
 * Format: Full Project Plan with Tech Stack Comparison, Sprint Planning, Team Organization
 */
export function generateSRS(output: PipelineOutput): string {
    const { phases, domain, projectName, summary } = output;
    const lines: string[] = [];

    // ==================== HEADER ====================
    lines.push(`# SOFTWARE REQUIREMENTS SPECIFICATION`);
    lines.push(`# ${projectName.toUpperCase()}`);
    lines.push('');
    lines.push(`**Generated Date**: ${new Date().toISOString().split('T')[0]}`);
    lines.push(`**Domain**: ${domain.name.toUpperCase()}`);
    lines.push(`**Version**: 1.0`);
    lines.push(`**Status**: Draft`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== TABLE OF CONTENTS ====================
    lines.push('## TABLE OF CONTENTS');
    lines.push('');
    lines.push('1. [Executive Summary](#1-executive-summary)');
    lines.push('2. [Business Analysis](#2-business-analysis)');
    lines.push('   - 2.1 [Stakeholders & Users](#21-stakeholders--users)');
    lines.push('   - 2.2 [Business Goals & Success Metrics](#22-business-goals--success-metrics)');
    lines.push('   - 2.3 [Competitive Analysis](#23-competitive-analysis)');
    lines.push('3. [Technical Analysis](#3-technical-analysis)');
    lines.push('   - 3.1 [Tech Stack Comparison & Selection](#31-tech-stack-comparison--selection)');
    lines.push('   - 3.2 [Security Requirements](#32-security-requirements)');
    lines.push('   - 3.3 [Architecture Decisions](#33-architecture-decisions)');
    lines.push('4. [System Design](#4-system-design)');
    lines.push('   - 4.1 [High-Level Architecture](#41-high-level-architecture)');
    lines.push('   - 4.2 [Data Design & Schema](#42-data-design--schema)');
    lines.push('   - 4.3 [API Design](#43-api-design)');
    lines.push('5. [Feature Breakdown (MoSCoW)](#5-feature-breakdown-moscow)');
    lines.push('6. [Project Planning](#6-project-planning)');
    lines.push('   - 6.1 [Sprint Planning](#61-sprint-planning)');
    lines.push('   - 6.2 [Timeline & Milestones](#62-timeline--milestones)');
    lines.push('7. [Codebase Structure](#7-codebase-structure)');
    lines.push('8. [Team Organization](#8-team-organization)');
    lines.push('9. [Security & Compliance](#9-security--compliance)');
    lines.push('10. [QA Strategy](#10-qa-strategy)');
    lines.push('11. [DevOps & Infrastructure](#11-devops--infrastructure)');
    lines.push('12. [Risk Management](#12-risk-management)');
    lines.push('13. [Appendix](#13-appendix)');
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 1. EXECUTIVE SUMMARY ====================
    lines.push('## 1. EXECUTIVE SUMMARY');
    lines.push('');
    lines.push(`**Project Name**: ${projectName}`);
    lines.push(`**Domain**: ${domain.name}`);
    lines.push('');
    lines.push('### Overview');
    lines.push(`This document specifies the requirements for ${projectName}, a ${domain.name.toLowerCase()} system. `);
    lines.push(`The project will deliver ${summary.totalFeatures} core features across ${summary.totalModules} modules, `);
    lines.push(`with comprehensive security coverage addressing ${summary.totalThreats} identified threats.`);
    lines.push('');
    lines.push('### Key Metrics');
    lines.push(`- **Total Features**: ${summary.totalFeatures}`);
    lines.push(`- **Critical Threats**: ${summary.criticalThreats}`);
    lines.push(`- **Test Automation Coverage**: ${summary.automationCoverage}%`);
    lines.push(`- **Compliance Frameworks**: ${summary.complianceFrameworks.join(', ') || 'None'}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 2. BUSINESS ANALYSIS ====================
    lines.push('## 2. BUSINESS ANALYSIS');
    lines.push('');

    // 2.1 Stakeholders
    lines.push('### 2.1 Stakeholders & Users');
    lines.push('');
    if (domain.domain && domain.domain.stakeholders) {
        lines.push('| Stakeholder | Type | Data Access | Primary Needs |');
        lines.push('|-------------|------|-------------|---------------|');
        domain.domain.stakeholders.forEach(s => {
            const needs = getStakeholderNeeds(s.type);
            lines.push(`| **${s.name}** | ${s.type} | ${s.dataAccess} | ${needs} |`);
        });
    } else {
        lines.push('- Stakeholder analysis not available for this domain.');
    }
    lines.push('');

    // 2.2 Business Goals
    lines.push('### 2.2 Business Goals & Success Metrics');
    lines.push('');
    lines.push('#### Primary Objectives');
    lines.push(`- Deliver ${summary.totalFeatures} production-ready features`);
    lines.push(`- Achieve ${summary.automationCoverage}% test automation coverage`);
    lines.push(`- Mitigate ${summary.criticalThreats} critical security threats`);
    if (summary.complianceFrameworks.length > 0) {
        lines.push(`- Ensure compliance with ${summary.complianceFrameworks.join(', ')}`);
    }
    lines.push('');
    lines.push('#### Success Metrics (KPIs)');
    lines.push('| Metric | Target | Measurement Method |');
    lines.push('|--------|--------|--------------------|');
    lines.push('| Feature Completion | 100% | Sprint burndown chart |');
    lines.push('| Code Coverage | >80% | Jest/Pytest reports |');
    lines.push('| Security Posture | 0 critical vulnerabilities | SAST/DAST scans |');
    lines.push('| Performance | <200ms API response | Load testing (JMeter) |');
    lines.push('| Uptime SLA | 99.9% | Monitoring dashboard |');
    lines.push('');

    // 2.3 Competitive Analysis
    lines.push('### 2.3 Competitive Analysis');
    lines.push('');
    lines.push(generateCompetitiveAnalysis(domain.name));
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 3. TECHNICAL ANALYSIS ====================
    lines.push('## 3. TECHNICAL ANALYSIS');
    lines.push('');

    // 3.1 Tech Stack Comparison
    lines.push('### 3.1 Tech Stack Comparison & Selection');
    lines.push('');
    lines.push(generateTechStackComparison(phases.techLead.pseudocode[0]?.language || 'python', domain.name));
    lines.push('');

    // 3.2 Security Requirements
    lines.push('### 3.2 Security Requirements');
    lines.push('');
    lines.push('| ID | Category | Requirement | Priority | Compliance Mapping |');
    lines.push('|----|----------|-------------|----------|-------------------|');
    phases.ba.securityRequirements.slice(0, 10).forEach(req => {
        const compliance = req.complianceMapping?.join(', ') || 'N/A';
        lines.push(`| ${req.id} | ${req.category} | ${req.requirement} | ${req.priority.toUpperCase()} | ${compliance} |`);
    });
    lines.push('');
    lines.push(`*Full list: ${phases.ba.securityRequirements.length} requirements*`);
    lines.push('');

    // 3.3 Architecture Decisions
    lines.push('### 3.3 Architecture Decisions');
    lines.push('');
    if (phases.techLead.designPatterns && phases.techLead.designPatterns.length > 0) {
        lines.push('| Pattern | Description | Justification | Tradeoffs |');
        lines.push('|---------|-------------|---------------|-----------|');
        phases.techLead.designPatterns.forEach(dp => {
            const tradeoffs = dp.tradeoffs ? dp.tradeoffs.join('; ') : 'None';
            lines.push(`| **${dp.name}** | ${dp.description} | ${dp.justification} | ${tradeoffs} |`);
        });
    } else {
        lines.push('**Architecture Pattern**: Layered Architecture (Presentation → Business → Data)');
        lines.push('');
        lines.push('**Key Decisions**:');
        lines.push('- Microservices architecture for scalability');
        lines.push('- Event-driven communication (message queue)');
        lines.push('- Database per service pattern');
    }
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 4. SYSTEM DESIGN ====================
    lines.push('## 4. SYSTEM DESIGN');
    lines.push('');

    // 4.1 Architecture Diagram
    lines.push('### 4.1 High-Level Architecture');
    lines.push('');
    lines.push(phases.techLead.architectureDiagram);
    lines.push('');

    // 4.2 Data Design
    lines.push('### 4.2 Data Design & Schema');
    lines.push('');
    lines.push('#### Core Entities');
    lines.push('| Entity | Key Fields | Description |');
    lines.push('|--------|-----------|-------------|');
    
    // Extract entities from modules
    const entities = extractEntities(phases.techLead.modules);
    if (entities.length > 0) {
        entities.forEach(e => lines.push(`| ${e.name} | ${e.fields} | ${e.description} |`));
    } else {
        lines.push('| User | id, email, passwordHash, role | User account |');
        lines.push('| Session | id, userId, token, expiresAt | Authentication session |');
        lines.push('| AuditLog | id, userId, action, timestamp | Security audit trail |');
    }
    lines.push('');

    // 4.3 API Design
    lines.push('### 4.3 API Design');
    lines.push('');
    lines.push(generateAPIDesign(phases.techLead.modules));
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 5. FEATURE BREAKDOWN ====================
    lines.push('## 5. FEATURE BREAKDOWN (MoSCoW)');
    lines.push('');
    lines.push('**MoSCoW Priority**: Must Have (P0) → Should Have (P1) → Could Have (P2) → Won\'t Have (P3)');
    lines.push('');

    ['P0', 'P1', 'P2'].forEach(prio => {
        const stories = phases.ba.userStories.filter(us => us.priority === prio);
        if (stories.length === 0) return;

        const priorityLabel = { P0: 'MUST HAVE', P1: 'SHOULD HAVE', P2: 'COULD HAVE' }[prio];
        lines.push(`### ${priorityLabel} Features (Priority ${prio})`);
        lines.push('');

        stories.forEach(us => {
            lines.push(`#### ${us.id}: ${us.title}`);
            lines.push(`- **User Story**: As a ${us.asA}, I want ${us.iWant}, so that ${us.soThat}`);
            lines.push(`- **Priority**: ${us.priority} | **Effort**: ${us.estimatedEffort}`);
            lines.push('- **Acceptance Criteria**:');
            us.acceptanceCriteria.forEach(ac => lines.push(`  - [ ] ${ac}`));
            if (us.securityConsiderations && us.securityConsiderations.length > 0) {
                lines.push('- **Security Considerations**: ' + us.securityConsiderations.join(', '));
            }
            lines.push('');
        });
    });
    lines.push('---');
    lines.push('');

    // ==================== 6. PROJECT PLANNING ====================
    lines.push('## 6. PROJECT PLANNING');
    lines.push('');

    // 6.1 Sprint Planning
    lines.push('### 6.1 Sprint Planning (2 Weeks/Sprint)');
    lines.push('');
    lines.push(generateSprintPlan(phases.techLead.features, phases.ba.userStories));
    lines.push('');

    // 6.2 Timeline
    lines.push('### 6.2 Timeline & Milestones');
    lines.push('');
    lines.push(generateTimeline(phases.techLead.features));
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 7. CODEBASE STRUCTURE ====================
    lines.push('## 7. CODEBASE STRUCTURE');
    lines.push('');
    lines.push('```');
    lines.push(`${projectName.toLowerCase().replace(/\s+/g, '-')}/`);
    
    if (phases.techLead.fileStructure && phases.techLead.fileStructure.length > 0) {
        phases.techLead.fileStructure.forEach(node => {
            renderFileTree(node, lines, '');
        });
    } else {
        lines.push('├── src/');
        phases.techLead.modules.forEach((mod, idx) => {
            const isLast = idx === phases.techLead.modules.length - 1;
            const prefix = isLast ? '└──' : '├──';
            lines.push(`│   ${prefix} ${toKebabCase(mod.name)}/`);
            mod.classes.forEach(cls => {
                lines.push(`│   │   ├── ${toKebabCase(cls.name)}.ts`);
            });
        });
        lines.push('├── tests/');
        lines.push('├── docs/');
        lines.push('└── README.md');
    }
    lines.push('```');
    lines.push('');

    // Show key pseudocode files
    lines.push('### 7.1 Key Implementation Files (Pseudocode)');
    lines.push('');
    phases.techLead.pseudocode.slice(0, 2).forEach(pc => {
        lines.push(`#### ${pc.filename}`);
        lines.push(`**Purpose**: ${pc.purpose}`);
        lines.push('');
        lines.push('```' + pc.language);
        // Show only first 30 lines to keep SRS concise
        const contentLines = pc.content.split('\n').slice(0, 30);
        lines.push(contentLines.join('\n'));
        if (pc.content.split('\n').length > 30) {
            lines.push('// ... (see full pseudocode in appendix)');
        }
        lines.push('```');
        lines.push('');
    });
    lines.push('*Full pseudocode available in Appendix B*');
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 8. TEAM ORGANIZATION ====================
    lines.push('## 8. TEAM ORGANIZATION');
    lines.push('');
    lines.push('### 8.1 Team Structure');
    lines.push('');
    lines.push('| Role | Count | Responsibilities | Key Skills |');
    lines.push('|------|-------|------------------|------------|');
    lines.push('| **Tech Lead** | 1 | Architecture, Code Review, Technical Decisions | System Design, ' + (phases.techLead.pseudocode[0]?.language || 'Python') + ', Security |');
    lines.push('| **Security Engineer** | 1 | Threat Modeling, Security Testing, Compliance | OWASP, Penetration Testing, ' + (summary.complianceFrameworks[0] || 'Security Standards') + ' |');
    lines.push('| **Backend Developer** | 2-3 | API Development, Database Design | ' + (phases.techLead.pseudocode[0]?.language || 'Python') + ', SQL, REST API |');
    lines.push('| **QA Engineer** | 1-2 | Test Strategy, Automation, Security Testing | Selenium, Jest, Burp Suite |');
    lines.push('| **DevOps Engineer** | 1 | CI/CD, Infrastructure, Monitoring | Docker, Kubernetes, GitHub Actions |');
    lines.push('| **Business Analyst** | 1 | Requirements, User Stories, Stakeholder Communication | Agile, Domain Knowledge |');
    lines.push('');
    lines.push('### 8.2 Development Workflow');
    lines.push('');
    lines.push('**Methodology**: Scrum/Agile');
    lines.push('- Sprint Duration: 2 weeks');
    lines.push('- Daily Standups: 15 minutes');
    lines.push('- Sprint Planning: First day of sprint');
    lines.push('- Sprint Review: Last day of sprint');
    lines.push('- Retrospective: After sprint review');
    lines.push('');
    lines.push('**Git Workflow**:');
    lines.push('1. `main` branch - Production');
    lines.push('2. `develop` branch - Integration');
    lines.push('3. Feature branches: `feature/US-XXX-description`');
    lines.push('4. Hotfix branches: `hotfix/critical-bug`');
    lines.push('5. Pull Request → Code Review → Merge to develop → QA → Merge to main');
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 9. SECURITY & COMPLIANCE ====================
    lines.push('## 9. SECURITY & COMPLIANCE');
    lines.push('');

    // 9.1 Threat Model
    lines.push('### 9.1 Threat Model (STRIDE)');
    lines.push('');
    lines.push('| ID | Threat | Category | Impact | Risk Score | Mitigation |');
    lines.push('|----|--------|----------|--------|------------|------------|');
    phases.security.threats.slice(0, 10).forEach(t => {
        const mitigation = t.mitigation[0] || 'See full report';
        lines.push(`| ${t.id} | ${t.name} | ${t.category} | ${t.impact.toUpperCase()} | ${t.riskScore.toFixed(1)} | ${mitigation} |`);
    });
    lines.push('');
    lines.push(`*Full threat model: ${phases.security.threats.length} threats identified*`);
    lines.push('');

    // 9.2 Security Controls
    lines.push('### 9.2 Security Controls Implementation');
    lines.push('');
    lines.push('| Control | Description | Status |');
    lines.push('|---------|-------------|--------|');
    lines.push('| **Authentication** | Multi-factor authentication (MFA) | ✅ Required |');
    lines.push('| **Authorization** | Role-Based Access Control (RBAC) | ✅ Required |');
    lines.push('| **Encryption at Rest** | AES-256 for sensitive data | ✅ Required |');
    lines.push('| **Encryption in Transit** | TLS 1.3 for all connections | ✅ Required |');
    lines.push('| **Input Validation** | Sanitization on all user input | ✅ Required |');
    lines.push('| **Audit Logging** | Comprehensive logging of all actions | ✅ Required |');
    lines.push('| **Rate Limiting** | API throttling (100 req/min) | ✅ Required |');
    lines.push('| **Security Headers** | CSP, HSTS, X-Frame-Options | ✅ Required |');
    lines.push('');

    // 9.3 Compliance
    if (summary.complianceFrameworks.length > 0) {
        lines.push('### 9.3 Compliance Requirements');
        lines.push('');
        summary.complianceFrameworks.forEach(framework => {
            lines.push(`#### ${framework}`);
            const reqs = domain.compliance?.regulations.find(r => r.name === framework);
            if (reqs && reqs.requirements) {
                reqs.requirements.slice(0, 3).forEach(req => {
                    lines.push(`- **${req.id}**: ${req.name} - ${req.description}`);
                });
            }
            lines.push('');
        });
    }
    lines.push('---');
    lines.push('');

    // ==================== 10. QA STRATEGY ====================
    lines.push('## 10. QA STRATEGY');
    lines.push('');
    lines.push(`**Automation Coverage Goal**: ${phases.qa.automationCoverage.percentage}%`);
    lines.push(`**Total Test Cases**: ${phases.qa.testCases.length}`);
    lines.push('');

    lines.push('### 10.1 Testing Pyramid');
    lines.push('```');
    lines.push('        E2E Tests (10%)');
    lines.push('       /            \\');
    lines.push('   Integration (30%)');
    lines.push('  /                  \\');
    lines.push(' Unit Tests (60%)');
    lines.push('```');
    lines.push('');

    lines.push('### 10.2 Test Plan Summary');
    lines.push('');
    lines.push('| Category | Count | Automated | Manual |');
    lines.push('|----------|-------|-----------|--------|');
    const testByCategory = groupTestsByCategory(phases.qa.testCases);
    Object.entries(testByCategory).forEach(([cat, tests]) => {
        const auto = tests.filter(t => t.automated).length;
        const manual = tests.length - auto;
        lines.push(`| ${cat} | ${tests.length} | ${auto} | ${manual} |`);
    });
    lines.push('');

    lines.push('### 10.3 Penetration Testing Plan');
    lines.push('');
    lines.push('| Phase | Duration | Activities |');
    lines.push('|-------|----------|------------|');
    phases.qa.penetrationTestPlan.forEach(phase => {
        const activities = phase.activities.slice(0, 3).join('; ');
        lines.push(`| ${phase.phase} | ${phase.duration} | ${activities} |`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 11. DEVOPS & INFRASTRUCTURE ====================
    lines.push('## 11. DEVOPS & INFRASTRUCTURE');
    lines.push('');

    lines.push('### 11.1 CI/CD Pipeline');
    lines.push('');
    phases.devops.pipelineStages.forEach(stage => {
        lines.push(`**Stage ${stage.order}: ${stage.name}**`);
        stage.jobs.forEach(job => {
            lines.push(`- ${job.name}`);
            if (job.commands.length > 0) {
                lines.push(`  \`\`\`bash`);
                job.commands.forEach(cmd => lines.push(`  ${cmd}`));
                lines.push(`  \`\`\``);
            }
        });
        lines.push('');
    });

    lines.push('### 11.2 Security Gates');
    lines.push('');
    lines.push('| Gate | Tool | Fail Condition |');
    lines.push('|------|------|----------------|');
    phases.devops.securityGates.forEach(gate => {
        lines.push(`| ${gate.name} | ${gate.tool} | ${gate.failCondition} |`);
    });
    lines.push('');

    lines.push('### 11.3 Deployment Strategy');
    lines.push('');
    lines.push(`- **Strategy**: ${phases.devops.deploymentConfig.strategy}`);
    lines.push(`- **Rollback**: ${phases.devops.deploymentConfig.rollbackEnabled ? 'Enabled (automatic on health check failure)' : 'Manual'}`);
    lines.push(`- **Health Check**: ${phases.devops.deploymentConfig.healthCheck}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 12. RISK MANAGEMENT ====================
    lines.push('## 12. RISK MANAGEMENT');
    lines.push('');
    lines.push(generateRiskManagement(phases.security.threats, phases.ba.abuseCases));
    lines.push('');
    lines.push('---');
    lines.push('');

    // ==================== 13. APPENDIX ====================
    lines.push('## 13. APPENDIX');
    lines.push('');
    lines.push('### Appendix A: Glossary');
    lines.push(generateGlossary(domain.name));
    lines.push('');
    lines.push('### Appendix B: Full Pseudocode');
    lines.push(`*Available in separate document: \`pseudocode-${projectName.toLowerCase().replace(/\s+/g, '-')}.md\`*`);
    lines.push('');
    lines.push('### Appendix C: References');
    lines.push('- OWASP Top 10: https://owasp.org/www-project-top-ten/');
    lines.push('- CWE Top 25: https://cwe.mitre.org/top25/');
    if (domain.name.includes('Signal') || domain.name.includes('Crypto')) {
        lines.push('- Signal Protocol Specifications: https://signal.org/docs/');
    }
    if (domain.name.includes('Malware')) {
        lines.push('- MITRE ATT&CK Framework: https://attack.mitre.org/');
    }
    if (domain.name.includes('Blockchain')) {
        lines.push('- Smart Contract Security Verification Standard: https://github.com/securing/SCSVS');
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('**END OF DOCUMENT**');

    return lines.join('\n');
}

// ==================== HELPER FUNCTIONS ====================

function getStakeholderNeeds(type: string): string {
    const needs: Record<string, string> = {
        'end_user': 'Easy to use, Fast, Secure',
        'professional': 'Advanced features, Customization, Support',
        'internal': 'Efficient tools, Documentation, Training',
        'governance': 'Compliance, Audit trails, Reports',
        'business_partner': 'API access, Integration, SLA'
    };
    return needs[type] || 'Standard access';
}

function generateCompetitiveAnalysis(domainName: string): string {
    const lines: string[] = [];
    lines.push('| Competitor | Strengths | Weaknesses | Market Position |');
    lines.push('|------------|-----------|------------|-----------------|');
    
    if (domainName.includes('Signal') || domainName.includes('Crypto')) {
        lines.push('| **Signal** | E2EE, Open source, Privacy-first | Limited features, UI/UX | Leader in privacy |');
        lines.push('| **WhatsApp** | Massive user base, Easy to use | Metadata collection, Closed source | Market leader |');
        lines.push('| **Telegram** | Feature-rich, Cloud-based | Not E2EE by default | Growing alternative |');
    } else if (domainName.includes('Malware')) {
        lines.push('| **Cuckoo Sandbox** | Open source, Extensible | Setup complexity | Popular choice |');
        lines.push('| **Joe Sandbox** | Cloud-based, Easy to use | Expensive, Proprietary | Enterprise leader |');
        lines.push('| **ANY.RUN** | Interactive, Real-time | Limited free tier | Emerging player |');
    } else if (domainName.includes('Blockchain')) {
        lines.push('| **Ethereum** | Largest ecosystem, Mature | High gas fees, Scalability | Market leader |');
        lines.push('| **Solana** | Fast, Low fees | Network instability | Rising competitor |');
        lines.push('| **Polygon** | Layer 2, Low cost | Centralization concerns | Growing adoption |');
    } else {
        lines.push('| **Competitor A** | Feature X, Price | Weakness Y | Position Z |');
        lines.push('| **Competitor B** | Feature X, Price | Weakness Y | Position Z |');
        lines.push('| **Competitor C** | Feature X, Price | Weakness Y | Position Z |');
    }
    
    return lines.join('\n');
}

function generateTechStackComparison(selectedLang: string, domainName: string): string {
    const lines: string[] = [];
    
    lines.push('#### Evaluation Criteria');
    lines.push('| Criterion | Weight | ' + selectedLang.toUpperCase() + ' | Alternative A | Alternative B |');
    lines.push('|-----------|--------|' + '-'.repeat(selectedLang.length + 2) + '|---------------|---------------|');
    
    if (selectedLang === 'cpp' || domainName.includes('Malware')) {
        lines.push('| Performance | 30% | ⭐⭐⭐⭐⭐ (Native) | ⭐⭐⭐⭐⭐ (Rust) | ⭐⭐⭐ (Go) |');
        lines.push('| Memory Safety | 25% | ⭐⭐⭐ (Manual) | ⭐⭐⭐⭐⭐ (Rust Borrow Checker) | ⭐⭐⭐⭐ (Go GC) |');
        lines.push('| Ecosystem | 20% | ⭐⭐⭐⭐⭐ (Mature) | ⭐⭐⭐ (Growing) | ⭐⭐⭐⭐ (Good) |');
        lines.push('| Low-Level Access | 15% | ⭐⭐⭐⭐⭐ (Full) | ⭐⭐⭐⭐ (Unsafe blocks) | ⭐⭐ (Limited) |');
        lines.push('| Developer Velocity | 10% | ⭐⭐ (Slow) | ⭐⭐⭐ (Medium) | ⭐⭐⭐⭐ (Fast) |');
        lines.push('');
        lines.push('**🎯 DECISION: C++**');
        lines.push('- Mature ecosystem for malware analysis libraries (YARA, Capstone)');
        lines.push('- Direct kernel/driver development capabilities');
        lines.push('- Fine-grained control over memory and system resources');
    } else if (selectedLang === 'rust' || domainName.includes('Crypto')) {
        lines.push('| Performance | 30% | ⭐⭐⭐⭐⭐ (Native) | ⭐⭐⭐⭐⭐ (C++) | ⭐⭐⭐⭐ (Go) |');
        lines.push('| Memory Safety | 30% | ⭐⭐⭐⭐⭐ (Borrow Checker) | ⭐⭐⭐ (Manual) | ⭐⭐⭐⭐ (GC) |');
        lines.push('| Concurrency | 20% | ⭐⭐⭐⭐⭐ (Fearless) | ⭐⭐⭐ (Difficult) | ⭐⭐⭐⭐ (Goroutines) |');
        lines.push('| Crypto Libraries | 15% | ⭐⭐⭐⭐⭐ (ring, rustls) | ⭐⭐⭐⭐ (OpenSSL) | ⭐⭐⭐ (crypto/tls) |');
        lines.push('| Learning Curve | 5% | ⭐⭐ (Steep) | ⭐⭐ (Steep) | ⭐⭐⭐⭐ (Easy) |');
        lines.push('');
        lines.push('**🎯 DECISION: Rust**');
        lines.push('- Memory safety without GC overhead - critical for crypto operations');
        lines.push('- Modern cryptography libraries (ring, rustls, libsodium bindings)');
        lines.push('- Prevents entire classes of vulnerabilities (use-after-free, buffer overflows)');
    } else if (selectedLang === 'python') {
        lines.push('| Developer Velocity | 30% | ⭐⭐⭐⭐⭐ (Fast) | ⭐⭐⭐⭐ (TypeScript) | ⭐⭐⭐ (Java) |');
        lines.push('| Ecosystem | 25% | ⭐⭐⭐⭐⭐ (Rich) | ⭐⭐⭐⭐ (npm) | ⭐⭐⭐⭐ (Maven) |');
        lines.push('| Data Science | 20% | ⭐⭐⭐⭐⭐ (Best) | ⭐⭐⭐ (Good) | ⭐⭐⭐ (Good) |');
        lines.push('| Performance | 15% | ⭐⭐ (Slow) | ⭐⭐⭐⭐ (Fast) | ⭐⭐⭐⭐ (Fast) |');
        lines.push('| Type Safety | 10% | ⭐⭐⭐ (Optional) | ⭐⭐⭐⭐⭐ (Strong) | ⭐⭐⭐⭐⭐ (Strong) |');
        lines.push('');
        lines.push('**🎯 DECISION: Python**');
        lines.push('- Rapid prototyping and development speed');
        lines.push('- Extensive libraries for data processing, ML, automation');
        lines.push('- Strong community and tooling support');
    } else {
        lines.push('| Criterion 1 | 30% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |');
        lines.push('| Criterion 2 | 25% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |');
        lines.push('| Criterion 3 | 20% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |');
        lines.push('');
        lines.push(`**🎯 DECISION: ${selectedLang.toUpperCase()}**`);
        lines.push('- Best fit for project requirements');
    }
    
    return lines.join('\n');
}

function extractEntities(modules: any[]): Array<{name: string, fields: string, description: string}> {
    const entities: Array<{name: string, fields: string, description: string}> = [];
    
    for (const mod of modules) {
        for (const cls of mod.classes) {
            if (cls.name.endsWith('Entity') || cls.name.endsWith('Dto') || cls.name.endsWith('Model')) {
                const fields = cls.properties
                    .slice(0, 4)
                    .map((p: any) => `${p.name}: ${p.type}`)
                    .join(', ');
                
                if (fields) {
                    entities.push({
                        name: cls.name,
                        fields: fields,
                        description: cls.purpose
                    });
                }
            }
        }
    }
    
    return entities;
}

function generateAPIDesign(modules: any[]): string {
    const lines: string[] = [];
    
    lines.push('**RESTful API Endpoints**');
    lines.push('');
    lines.push('| Method | Endpoint | Description | Auth Required |');
    lines.push('|--------|----------|-------------|---------------|');
    
    // Generate endpoints from controller modules
    const controllers = modules.filter(m => 
        m.type === 'controller' || m.name.includes('Controller')
    );
    
    if (controllers.length > 0) {
        controllers.forEach(ctrl => {
            const basePath = toKebabCase(ctrl.name.replace('Controller', ''));
            lines.push(`| POST | /api/${basePath} | Create new ${basePath} | ✅ JWT |`);
            lines.push(`| GET | /api/${basePath}/:id | Get ${basePath} by ID | ✅ JWT |`);
            lines.push(`| PUT | /api/${basePath}/:id | Update ${basePath} | ✅ JWT |`);
            lines.push(`| DELETE | /api/${basePath}/:id | Delete ${basePath} | ✅ JWT + Admin |`);
        });
    } else {
        // Default endpoints
        lines.push('| POST | /api/auth/login | User authentication | ❌ Public |');
        lines.push('| POST | /api/auth/register | User registration | ❌ Public |');
        lines.push('| GET | /api/users/:id | Get user profile | ✅ JWT |');
        lines.push('| PUT | /api/users/:id | Update user profile | ✅ JWT |');
    }
    
    lines.push('');
    lines.push('**Authentication**: JWT Bearer Token in `Authorization` header');
    lines.push('**Rate Limiting**: 100 requests per minute per IP');
    lines.push('**Response Format**: JSON with standard structure `{success, data, error}`');
    
    return lines.join('\n');
}

function generateSprintPlan(features: any[], userStories: any[]): string {
    const lines: string[] = [];
    let taskId = 1;
    let sprintNum = 1;
    
    // Group features by priority and create sprints
    const p0Features = features.filter(f => f.priority === 'P0');
    const p1Features = features.filter(f => f.priority === 'P1');
    
    // Sprint 1-2: P0 Features
    p0Features.slice(0, 2).forEach((feat, idx) => {
        lines.push(`#### Sprint ${sprintNum}: ${feat.name} (Priority P0)`);
        lines.push('');
        lines.push('| Task ID | Description | Type | Assignee | Est. Time | Dependencies |');
        lines.push('|---------|-------------|------|----------|-----------|--------------|');
        
        // Design tasks
        lines.push(`| T-${String(taskId++).padStart(3, '0')} | Architecture design for ${feat.name} | Design | Tech Lead | 8h | - |`);
        lines.push(`| T-${String(taskId++).padStart(3, '0')} | Database schema design | Design | Tech Lead | 4h | T-001 |`);
        
        // Development tasks
        feat.subFeatures.slice(0, 3).forEach((sub: any) => {
            lines.push(`| T-${String(taskId++).padStart(3, '0')} | Implement ${sub.name} | Dev | Backend | 16h | T-002 |`);
            lines.push(`| T-${String(taskId++).padStart(3, '0')} | Unit tests for ${sub.name} | QA | QA Eng | 6h | T-${String(taskId-1).padStart(3, '0')} |`);
        });
        
        // Security & Integration
        lines.push(`| T-${String(taskId++).padStart(3, '0')} | Security review for ${feat.name} | Sec | Sec Eng | 8h | T-${String(taskId-2).padStart(3, '0')} |`);
        lines.push(`| T-${String(taskId++).padStart(3, '0')} | Integration testing | QA | QA Eng | 8h | T-${String(taskId-1).padStart(3, '0')} |`);
        
        lines.push('');
        sprintNum++;
    });
    
    // Sprint 3-4: P1 Features
    p1Features.slice(0, 2).forEach((feat, idx) => {
        lines.push(`#### Sprint ${sprintNum}: ${feat.name} (Priority P1)`);
        lines.push('');
        lines.push('| Task ID | Description | Type | Assignee | Est. Time | Dependencies |');
        lines.push('|---------|-------------|------|----------|-----------|--------------|');
        
        feat.subFeatures.slice(0, 2).forEach((sub: any) => {
            lines.push(`| T-${String(taskId++).padStart(3, '0')} | Implement ${sub.name} | Dev | Backend | 12h | Sprint ${sprintNum-1} |`);
            lines.push(`| T-${String(taskId++).padStart(3, '0')} | Tests for ${sub.name} | QA | QA Eng | 4h | T-${String(taskId-1).padStart(3, '0')} |`);
        });
        
        lines.push('');
        sprintNum++;
    });
    
    // Final Sprint: Hardening & Release
    lines.push(`#### Sprint ${sprintNum}: Hardening & Release Preparation`);
    lines.push('');
    lines.push('| Task ID | Description | Type | Assignee | Est. Time |');
    lines.push('|---------|-------------|------|----------|-----------|');
    lines.push(`| T-${String(taskId++).padStart(3, '0')} | Penetration testing | Sec | Sec Eng | 40h |`);
    lines.push(`| T-${String(taskId++).padStart(3, '0')} | Performance optimization | Dev | Tech Lead | 16h |`);
    lines.push(`| T-${String(taskId++).padStart(3, '0')} | Documentation completion | Doc | All | 16h |`);
    lines.push(`| T-${String(taskId++).padStart(3, '0')} | Production deployment | DevOps | DevOps | 8h |`);
    
    return lines.join('\n');
}

function generateTimeline(features: any[]): string {
    const lines: string[] = [];
    const totalSprints = Math.ceil(features.length / 2) + 1; // +1 for hardening
    const totalWeeks = totalSprints * 2;
    
    lines.push('```mermaid');
    lines.push('gantt');
    lines.push('    title Project Timeline');
    lines.push('    dateFormat  YYYY-MM-DD');
    lines.push('    section Planning');
    lines.push('    Requirements Analysis    :done, plan1, 2024-01-01, 1w');
    lines.push('    Architecture Design      :done, plan2, after plan1, 1w');
    lines.push('    section Development');
    
    let currentDate = new Date('2024-01-15');
    features.slice(0, 4).forEach((feat, idx) => {
        const sprintNum = Math.floor(idx / 2) + 1;
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() + (idx * 14));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 14);
        
        lines.push(`    Sprint ${sprintNum} - ${feat.name.slice(0, 20)}    :active, dev${idx}, ${startDate.toISOString().split('T')[0]}, 2w`);
    });
    
    lines.push('    section Testing');
    const testStart = new Date(currentDate);
    testStart.setDate(testStart.getDate() + (features.slice(0, 4).length * 14));
    lines.push(`    Integration Testing      :test1, ${testStart.toISOString().split('T')[0]}, 1w`);
    
    const penTestStart = new Date(testStart);
    penTestStart.setDate(penTestStart.getDate() + 7);
    lines.push(`    Penetration Testing      :test2, ${penTestStart.toISOString().split('T')[0]}, 1w`);
    
    lines.push('    section Deployment');
    const deployStart = new Date(penTestStart);
    deployStart.setDate(deployStart.getDate() + 7);
    lines.push(`    Production Deployment    :milestone, deploy, ${deployStart.toISOString().split('T')[0]}, 0d`);
    lines.push('```');
    lines.push('');
    lines.push(`**Total Duration**: ${totalWeeks} weeks (${totalSprints} sprints)`);
    lines.push(`**Estimated Completion**: ${deployStart.toISOString().split('T')[0]}`);
    
    return lines.join('\n');
}

function groupTestsByCategory(testCases: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    testCases.forEach(tc => {
        if (!groups[tc.category]) {
            groups[tc.category] = [];
        }
        groups[tc.category].push(tc);
    });
    
    return groups;
}

function generateRiskManagement(threats: any[], abuseCases: any[]): string {
    const lines: string[] = [];
    
    lines.push('### 12.1 Risk Assessment Matrix');
    lines.push('');
    lines.push('| Risk | Category | Likelihood | Impact | Risk Score | Mitigation Strategy | Owner |');
    lines.push('|------|----------|------------|--------|------------|---------------------|-------|');
    
    // Top 5 critical risks from threats
    threats
        .filter(t => t.impact === 'critical')
        .slice(0, 5)
        .forEach(t => {
            const mitigation = t.mitigation[0] || 'See threat model';
            lines.push(`| ${t.name} | Technical | ${t.likelihood} | ${t.impact} | ${t.riskScore.toFixed(1)} | ${mitigation} | Security Eng |`);
        });
    
    // Add business risks
    lines.push('| Budget Overrun | Business | Medium | High | 7.0 | Weekly budget reviews, scope control | PM |');
    lines.push('| Key Developer Leaving | Operational | Low | High | 5.5 | Knowledge sharing, documentation | Tech Lead |');
    lines.push('| Third-party Dependency Failure | Technical | Medium | Medium | 5.0 | Vendor evaluation, fallback plan | DevOps |');
    
    lines.push('');
    lines.push('### 12.2 Risk Mitigation Plan');
    lines.push('');
    lines.push('**High-Priority Actions**:');
    lines.push('1. Implement all P0 security requirements before MVP release');
    lines.push('2. Conduct security code review for all authentication/authorization modules');
    lines.push('3. Setup automated security scanning in CI/CD pipeline');
    lines.push('4. Establish incident response plan with 24/7 on-call rotation');
    lines.push('');
    lines.push('**Monitoring & Review**:');
    lines.push('- Weekly risk review in sprint retrospectives');
    lines.push('- Monthly security posture assessment');
    lines.push('- Quarterly penetration testing exercises');
    
    return lines.join('\n');
}

function generateGlossary(domainName: string): string {
    const lines: string[] = [];
    
    lines.push('');
    lines.push('| Term | Definition |');
    lines.push('|------|------------|');
    
    // Common terms
    lines.push('| **RBAC** | Role-Based Access Control - Authorization model based on user roles |');
    lines.push('| **JWT** | JSON Web Token - Compact token format for authentication |');
    lines.push('| **MFA** | Multi-Factor Authentication - Security requiring multiple verification methods |');
    lines.push('| **STRIDE** | Threat modeling framework: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege |');
    lines.push('| **SAST** | Static Application Security Testing - Code analysis without execution |');
    lines.push('| **DAST** | Dynamic Application Security Testing - Runtime security testing |');
    
    // Domain-specific terms
    if (domainName.includes('Signal') || domainName.includes('Crypto')) {
        lines.push('| **E2EE** | End-to-End Encryption - Only sender and recipient can read messages |');
        lines.push('| **X3DH** | Extended Triple Diffie-Hellman - Key agreement protocol |');
        lines.push('| **Double Ratchet** | Cryptographic protocol providing forward and future secrecy |');
        lines.push('| **PreKey** | Public key uploaded to server for asynchronous messaging |');
    }
    
    if (domainName.includes('Malware')) {
        lines.push('| **IOC** | Indicator of Compromise - Artifact indicating security breach |');
        lines.push('| **Sandbox** | Isolated environment for safely executing untrusted code |');
        lines.push('| **C2** | Command and Control - Infrastructure used by attackers to control malware |');
        lines.push('| **YARA** | Pattern matching tool for malware identification |');
    }
    
    if (domainName.includes('Blockchain')) {
        lines.push('| **Smart Contract** | Self-executing contract with terms written in code |');
        lines.push('| **Gas** | Computational effort required to execute operations on blockchain |');
        lines.push('| **Reentrancy** | Vulnerability where external call can re-enter function before completion |');
        lines.push('| **SCSVS** | Smart Contract Security Verification Standard |');
    }
    
    return lines.join('\n');
}

function renderFileTree(node: any, lines: string[], prefix: string): void {
    const description = node.description ? `  # ${node.description}` : '';
    lines.push(`${prefix}├── ${node.name}${description}`);
    
    if (node.children && node.children.length > 0) {
        node.children.forEach((child: any, idx: number) => {
            const isLast = idx === node.children.length - 1;
            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            renderFileTree(child, lines, childPrefix);
        });
    }
}

function toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}