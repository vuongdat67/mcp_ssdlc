import type { PipelineOutput } from '../orchestrator/index.js';

/**
 * Generate a comprehensive Software Requirements Specification (SRS) / Project Plan
 * based on the user's preferred "Professional Plan" format.
 */
export function generateSRS(output: PipelineOutput): string {
    const { phases, domain, projectName, summary } = output;
    const lines: string[] = [];

    // --- Header ---
    lines.push(`# SOFTWARE REQUIREMENTS SPECIFICATION: ${projectName.toUpperCase()}`);
    lines.push(`**Generated Date**: ${new Date().toISOString().split('T')[0]}`);
    lines.push(`**Domain**: ${domain.name.toUpperCase()}`);
    lines.push('');

    // --- 1. BUSINESS ANALYSIS ---
    lines.push('## 1. BUSINESS ANALYSIS');

    lines.push('### 1.1 Stakeholders & Users');
    if (domain.domain && domain.domain.stakeholders) {
        lines.push('| Stakeholder | Type | Data Access |');
        lines.push('|-------------|------|-------------|');
        domain.domain.stakeholders.forEach(s => {
            lines.push(`| **${s.name}** | ${s.type} | ${s.dataAccess} |`);
        });
    } else {
        lines.push('- [Stakeholder list not defined in domain model]');
    }
    lines.push('');

    lines.push('### 1.2 Business Goals & Success Criteria');
    lines.push('- **Goals**:');
    // Note: Business goals are passed in input but not explicitly in BAOutput structure directly? 
    // Actually BAOutput usually has projectDescription. We'll use summary metrics as proxy for success criteria.
    lines.push(`  - Deliver ${summary.totalFeatures} core features.`);
    lines.push(`  - Mitigate ${summary.criticalThreats} critical threats.`);
    lines.push(`  - Achieve ${summary.automationCoverage}% test automation coverage.`);
    lines.push('');

    lines.push('### 1.3 Competitive Analysis (Placeholder)');
    lines.push('| Competitor | Pros | Cons | Market Service |');
    lines.push('|------------|------|------|----------------|');
    lines.push('| [Comp A]   | ...  | ...  | ...            |');
    lines.push('');

    // --- 2. TECHNICAL ANALYSIS ---
    lines.push('## 2. TECHNICAL ANALYSIS');

    lines.push('### 2.1 Tech Stack Comparison & Recommendation');
    lines.push('| Criteria | Selected (C++) | Option B (Rust) | Option C (Go) |');
    lines.push('|----------|----------------|-----------------|---------------|');
    lines.push('| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |');
    lines.push('| Memory Safety | ⭐⭐⭐ (Manual) | ⭐⭐⭐⭐⭐ (Borrow Checker) | ⭐⭐⭐⭐ (GC) |');
    lines.push('| Ecosystem (Security) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |');
    lines.push('| Kernel Access | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |');
    lines.push('');
    lines.push('🎯 **RECOMMENDATION**: **C++** selected due to mature ecosystem for malware analysis dependencies and direct kernel/driver development capabilities essential for this sandbox.');
    lines.push('');

    lines.push('### 2.2 Security Requirements');
    phases.ba.securityRequirements.forEach(req => {
        lines.push(`- [${req.priority.toUpperCase()}] **${req.category}**: ${req.requirement}`);
    });
    lines.push('');

    lines.push('### 2.3 Architecture Decisions');
    if (phases.techLead.designPatterns && phases.techLead.designPatterns.length > 0) {
        lines.push('| Pattern | Description | Justification | Tradeoffs |');
        lines.push('|---------|-------------|---------------|-----------|');
        phases.techLead.designPatterns.forEach(dp => {
            const tradeoffs = dp.tradeoffs ? dp.tradeoffs.join(', ') : 'None';
            lines.push(`| **${dp.name}** | ${dp.description} | ${dp.justification} | ${tradeoffs} |`);
        });
    } else {
        lines.push('- No specific design patterns generated.');
    }
    lines.push('');

    // --- 3. SYSTEM DESIGN ---
    lines.push('## 3. SYSTEM DESIGN');

    lines.push('### 3.1 High-Level Architecture');
    lines.push('```mermaid');
    lines.push(phases.techLead.architectureDiagram);
    lines.push('```');
    lines.push('');

    lines.push('### 3.2 Data Design & Schema');
    lines.push('**Core Entities:**');
    lines.push('| Entity | Fields | Description |');
    lines.push('|--------|--------|-------------|');
    // Infer schema from "classes" if possible, otherwise generic stub
    if (phases.techLead.modules.length > 0) {
        phases.techLead.modules.forEach(m => {
            m.classes.forEach(c => {
                // heuristic to find DTOs or Entities
                if (c.name.endsWith('Dto') || c.name.endsWith('Entity') || c.properties.length > 0) {
                    const props = c.properties.map(p => `${p.name}:${p.type}`).join(', ');
                    if (props) lines.push(`| ${c.name} | ${props} | ${c.purpose} |`);
                }
            });
        });
    }
    lines.push('| AnalysisReport | id:uuid, malware_hash:string, behavioral_score:int, created_at:timestamp | Final report structure |');
    lines.push('| IOC | id:uuid, type:string, value:string, confidence:float | Indicators of Compromise |');
    lines.push('');

    // --- 4. FEATURE BREAKDOWN ---
    lines.push('## 4. FEATURE BREAKDOWN (MoSCoW)');

    // Group by Priority
    ['P0', 'P1', 'P2'].forEach(prio => {
        const stories = phases.ba.userStories.filter(us => us.priority === prio || (prio === 'P0' && !us.priority)); // Default to P0 if missing
        if (stories.length === 0) return;

        lines.push(`### Priority ${prio} Features`);
        stories.forEach(us => {
            lines.push(`#### ${us.id}: ${us.title}`);
            lines.push(`- **User**: ${us.asA} | **Goal**: ${us.iWant}`);
            lines.push(`- **Benefit**: ${us.soThat}`);
            lines.push('- **Acceptance Criteria**:');
            us.acceptanceCriteria.forEach(ac => lines.push(`  - [ ] ${ac}`));
            lines.push('');
        });
    });

    // --- 5. PROJECT PLANNING ---
    lines.push('## 5. PROJECT PLANNING & TIMELINE');
    lines.push('### 5.1 Sprint Planning (2 Weeks/Sprint)');

    let taskIdCounter = 1;
    phases.techLead.features.forEach((feat, idx) => {
        const sprintNum = Math.floor(idx / 2) + 1;
        lines.push(`\n**SPRINT ${sprintNum}: ${feat.name}**`);
        lines.push('| Task ID | Description | Type | Assignee | Est. Time |');
        lines.push('|---------|-------------|------|----------|-----------|');

        // Break down feature into tasks
        lines.push(`| T-${String(taskIdCounter++).padStart(3, '0')} | Design Architecture for ${feat.name} | Design | Tech Lead | 8h |`);
        feat.subFeatures.forEach(sub => {
            lines.push(`| T-${String(taskIdCounter++).padStart(3, '0')} | Implement ${sub.name} | Dev | Backend | 16h |`);
            lines.push(`| T-${String(taskIdCounter++).padStart(3, '0')} | Unit Tests for ${sub.name} | QA | QA Eng | 6h |`);
        });
        lines.push(`| T-${String(taskIdCounter++).padStart(3, '0')} | Security Review for ${feat.name} | Sec | Sec Eng | 4h |`);
    });
    lines.push('');

    // --- 6. SYSTEM ARCHITECTURE & CODEBASE ---
    lines.push('## 6. CODEBASE STRUCTURE');
    lines.push('```');
    lines.push(`${projectName.toLowerCase().replace(/\s+/g, '-')}/`);

    if (phases.techLead.fileStructure && phases.techLead.fileStructure.length > 0) {
        // Use the generated file structure from Tech Lead
        phases.techLead.fileStructure.forEach(node => {
            renderFileTree(node, lines, '');
        });
    } else {
        // Fallback for older runs
        phases.techLead.modules.forEach(mod => {
            lines.push(`├── ${mod.name}/`);
            mod.classes.forEach(cls => {
                const ext = phases.techLead.pseudocode[0]?.language === 'cpp' ? '.h/.cpp' : '.ts';
                lines.push(`│   ├── ${cls.name}${ext}   # ${cls.purpose}`);
            });
        });
    }
    lines.push('```');
    lines.push('');

    lines.push('### 6.1 Code Implementation Plan (Pseudocode)');
    // Only show 2-3 key files to avoid bloat, or show headers
    phases.techLead.pseudocode.slice(0, 3).forEach(pc => {
        lines.push(`#### [FILE] ${pc.filename}`);
        lines.push(`**Purpose**: ${pc.purpose}`);
        lines.push('```' + pc.language);
        // Clean up content: strip lines making it look like full implementation if desired, but user wanted "logic comments"
        // The current pseudocode generator for CPP is quite verbose. We might want to condense it here?
        // User said: "Maybe no code at all, just pseudocode with focused comments"
        // Use the generated pseudocode as is, it's already "pseudocode".
        lines.push(pc.content);
        lines.push('```');
        lines.push('');
    });
    lines.push('*(...additional files omitted for brevity)*');
    lines.push('');

    // --- 7. TEAM ORGANIZATION ---
    lines.push('## 7. TEAM ORGANIZATION');
    lines.push('| Role | Responsibilities | Key Skills |');
    lines.push('|------|------------------|------------|');
    lines.push('| **Tech Lead** | Architecture, Core logic, Code Review | C++, Systems Design, Security |');
    lines.push('| **Security Eng** | Threat Modeling, Penetration Testing | Malware Analysis, Reverse Engineering |');
    lines.push('| **Backend Dev** | API Implementation, DB Schema | C++, SQL, API Design |');
    lines.push('| **DevOps** | CI/CD, Infrastructure, Monitoring | Docker, Kubernetes, script |');
    lines.push('');

    // --- 8. SECURITY & COMPLIANCE ---
    lines.push('## 8. SECURITY & COMPLIANCE');
    lines.push('### 8.1 Threat Model');
    lines.push('| Threat | Impact | Risk Score | Mitigation |');
    lines.push('|--------|--------|------------|------------|');
    phases.security.threats.forEach(t => {
        lines.push(`| ${t.name} | ${t.impact} | ${t.riskScore} | ${t.mitigation.slice(0, 1)} |`);
    });
    lines.push('');

    lines.push('### 8.2 Security Controls');
    if (domain.domain && domain.domain.securityStandards) {
        domain.domain.securityStandards.forEach(std => lines.push(`- **${std}** compliance required.`));
    } else {
        lines.push('- Standard OWASP Top 10 mitigation.');
        lines.push('- Secure Coding Practices guidelines.');
    }

    // --- 9. QA STRATEGY ---
    lines.push('## 9. QA STRATEGY');
    lines.push(`- **Automation Goal**: ${phases.qa.automationCoverage.percentage}% coverage.`);
    lines.push('- **Test Plan**:');
    phases.qa.testCases.slice(0, 5).forEach(tc => {
        lines.push(`  - [${tc.priority}] ${tc.title} (${tc.automated ? 'Automated' : 'Manual'})`);
    });
    lines.push('');

    // --- 10. DEVOPS ---
    lines.push('## 10. DEVOPS & INFRASTRUCTURE');
    if (phases.devops.buildConfig) {
        lines.push('### 10.1 Build Configuration');
        lines.push('```cmake');
        lines.push(phases.devops.buildConfig);
        lines.push('```');
    }
    lines.push('### 10.2 Pipeline Stages');
    phases.devops.pipelineStages.forEach(stage => {
        lines.push(`- **${stage.name}**: ${stage.jobs.map(j => j.name).join(', ')}`);
    });

    lines.push('');
    lines.push('# End of Specification');

    return lines.join('\n');
}

function renderFileTree(node: any, lines: string[], prefix: string) {
    const isLast = true; // Simplified for ASCII tree
    // Ideally we need to know if it's the last child in the list to choose └── vs ├──
    // For now we use standard tree chars.

    // Better tree logic:
    // This function assumes it's being called inside a loop where we can determine 'last'
    // But since the structure is recursive, we'll keep it simple for now or improve if needed.

    const description = node.description ? `  # ${node.description}` : '';
    lines.push(`${prefix}├── ${node.name}${description}`);

    if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => {
            renderFileTree(child, lines, prefix + '│   ');
        });
    }
}
