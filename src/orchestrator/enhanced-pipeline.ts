// Enhanced Pipeline với PM Tool và ADR Generator

import type { PipelineInput, PipelineOutput } from './index.js';
import type { PMOutput } from '../tools/bm/index.js';
import type { ADROutput } from '../tools/architecture/adr-generator.js';

import { loadDomainAuto } from '../domains/loader.js';
import { analyzeRequirements } from '../tools/ba/index.js';
import { techLeadDesign } from '../tools/tech-lead/index.js';
import { generateThreatModel } from '../tools/security/index.js';
import { designTestStrategy } from '../tools/qa/index.js';
import { designCICD } from '../tools/devops/index.js';
import { generateProjectPlan } from '../tools/bm/index.js';
import { generateADRs, exportADRAsMarkdown } from '../tools/architecture/adr-generator.js';

/**
 * Enhanced Pipeline Output
 */
export interface EnhancedPipelineOutput extends PipelineOutput {
    phases: {
        ba: any;
        techLead: any;
        security: any;
        qa: any;
        devops: any;
        pm: PMOutput;              // NEW: Project Management
        architecture: ADROutput;    // NEW: Architecture Decisions
    };
    deliverables: {
        srs: string;               // Software Requirements Specification (Markdown)
        adrDocuments: string[];    // Individual ADR documents (Markdown)
        projectPlan: string;       // Sprint plan + Gantt chart (Markdown)
        riskRegister: string;      // Risk analysis report (Markdown)
    };
}

/**
 * Run enhanced SSDLC pipeline with PM and ADR
 */
export async function orchestrateEnhancedPipeline(
    input: PipelineInput
): Promise<EnhancedPipelineOutput> {
    const {
        projectDescription,
        businessGoals,
        techStack,
        targetLanguage = 'python',
        deploymentTarget = 'kubernetes',
        repositoryPlatform = 'github',
        complianceRequirements = []
    } = input;

    console.log('🚀 Starting Enhanced SSDLC Pipeline...');

    // PHASE 0: Domain Detection
    console.log('📋 Phase 0: Detecting domain...');
    const domain = await loadDomainAuto(projectDescription);
    console.log(`   ✅ Domain detected: ${domain.name}`);

    // PHASE 1: Business Analysis
    console.log('📋 Phase 1: Business Analysis...');
    const baOutput = analyzeRequirements({
        projectDescription,
        businessGoals,
        domain
    });
    console.log(`   ✅ Generated ${baOutput.userStories.length} user stories`);
    console.log(`   ✅ Generated ${baOutput.securityRequirements.length} security requirements`);

    // PHASE 2: Tech Lead Design
    console.log('🏗️  Phase 2: Technical Design...');
    const techLeadOutput = await techLeadDesign({
        userStories: baOutput.userStories.map(s => ({
            id: s.id,
            title: s.title,
            asA: s.asA,
            iWant: s.iWant,
            soThat: s.soThat,
            priority: s.priority
        })),
        securityRequirements: baOutput.securityRequirements.map(r => r.requirement),
        targetLanguage: targetLanguage as any,
        projectName: baOutput.projectName,
        domainName: domain.name
    });
    console.log(`   ✅ Generated ${techLeadOutput.modules.length} modules`);
    console.log(`   ✅ Generated ${techLeadOutput.features.length} features`);
    console.log(`   ✅ Generated ${techLeadOutput.pseudocode.length} pseudocode files`);

    // PHASE 3: Security Threat Modeling
    console.log('🔒 Phase 3: Security Threat Modeling...');
    const securityOutput = generateThreatModel({
        modules: techLeadOutput.modules,
        domain,
        projectName: baOutput.projectName
    });
    console.log(`   ✅ Identified ${securityOutput.threats.length} threats`);
    console.log(`   ✅ Critical threats: ${securityOutput.threats.filter(t => t.impact === 'critical').length}`);

    // PHASE 4: QA Test Strategy
    console.log('✅ Phase 4: QA Test Strategy...');
    const qaOutput = designTestStrategy({
        features: techLeadOutput.features,
        threats: securityOutput.threats,
        complianceRequirements: [
            ...complianceRequirements,
            ...(domain.compliance?.regulations.map(r => r.name) || [])
        ]
    });
    console.log(`   ✅ Generated ${qaOutput.testCases.length} test cases`);
    console.log(`   ✅ Automation coverage: ${qaOutput.automationCoverage.percentage}%`);

    // PHASE 5: DevOps CI/CD
    console.log('🔧 Phase 5: DevOps CI/CD...');
    const devopsOutput = designCICD({
        projectName: baOutput.projectName,
        techStack,
        deploymentTarget,
        repositoryPlatform
    });
    console.log(`   ✅ Generated ${devopsOutput.pipelineStages.length} pipeline stages`);
    console.log(`   ✅ Security gates: ${devopsOutput.securityGates.length}`);

    // PHASE 6: Project Management (NEW)
    console.log('📊 Phase 6: Project Management & Sprint Planning...');
    const pmOutput = generateProjectPlan({
        features: techLeadOutput.features,
        threats: securityOutput.threats,
        teamSize: 3, // Default: 3-5 person team
        sprintDuration: 2, // 2-week sprints
        projectStartDate: new Date().toISOString().split('T')[0]
    });
    console.log(`   ✅ Generated ${pmOutput.sprints.length} sprints`);
    console.log(`   ✅ Task breakdown: ${pmOutput.taskBreakdown.length} tasks`);
    console.log(`   ✅ Critical path: ${pmOutput.criticalPath.totalDuration} days`);
    console.log(`   ✅ Identified ${pmOutput.riskRegister.length} risks`);

    // PHASE 7: Architecture Decision Records (NEW)
    console.log('🏛️  Phase 7: Architecture Decision Records...');
    const adrOutput = generateADRs({
        modules: techLeadOutput.modules,
        techStack,
        domain,
        projectName: baOutput.projectName,
        constraints: [
            {
                type: 'timeline',
                description: `Must deliver in ${pmOutput.sprints.length * 2} weeks`,
                hardConstraint: true,
                impact: 'Limits technology choices to mature, well-documented options'
            },
            {
                type: 'team_skill',
                description: 'Team has strong background in SQL and REST APIs',
                hardConstraint: false,
                impact: 'Prefer PostgreSQL over NoSQL, REST over GraphQL'
            }
        ]
    });
    console.log(`   ✅ Generated ${adrOutput.decisions.length} architecture decisions`);
    console.log(`   ✅ High-risk decisions: ${adrOutput.summary.highRiskDecisions.length}`);

    // PHASE 8: Generate Deliverables
    console.log('📄 Phase 8: Generating deliverables...');
    
    // 8.1 Export ADR documents
    const adrDocuments = adrOutput.decisions.map(adr => exportADRAsMarkdown(adr));
    
    // 8.2 Generate Project Plan document
    const projectPlan = generateProjectPlanMarkdown(pmOutput, baOutput.projectName);
    
    // 8.3 Generate Risk Register document
    const riskRegister = generateRiskRegisterMarkdown(pmOutput.riskRegister, baOutput.projectName);
    
    // 8.4 Generate SRS (existing function - would need to import)
    const srs = ''; // Would be generated by existing SRS exporter

    console.log('✅ Pipeline completed successfully!');

    return {
        orchestrationId: `ssdlc-${Date.now()}`,
        projectName: baOutput.projectName,
        domain,
        phases: {
            ba: baOutput,
            techLead: techLeadOutput,
            security: securityOutput,
            qa: qaOutput,
            devops: devopsOutput,
            pm: pmOutput,
            architecture: adrOutput
        },
        summary: {
            totalFeatures: techLeadOutput.features.length,
            totalModules: techLeadOutput.modules.length,
            totalThreats: securityOutput.threats.length,
            totalTestCases: qaOutput.testCases.length,
            criticalThreats: securityOutput.threats.filter(t => t.impact === 'critical').length,
            automationCoverage: qaOutput.automationCoverage.percentage,
            complianceFrameworks: domain.compliance?.regulations.map(r => r.name) || []
        },
        deliverables: {
            srs,
            adrDocuments,
            projectPlan,
            riskRegister
        }
    };
}

/**
 * Generate Project Plan Markdown document
 */
function generateProjectPlanMarkdown(pm: PMOutput, projectName: string): string {
    const lines: string[] = [];

    lines.push(`# PROJECT PLAN: ${projectName.toUpperCase()}`);
    lines.push('');
    lines.push(`**Generated**: ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // TABLE OF CONTENTS
    lines.push('## Table of Contents');
    lines.push('');
    lines.push('1. [Executive Summary](#executive-summary)');
    lines.push('2. [Sprint Overview](#sprint-overview)');
    lines.push('3. [Task Breakdown](#task-breakdown)');
    lines.push('4. [Team Allocation](#team-allocation)');
    lines.push('5. [Critical Path Analysis](#critical-path-analysis)');
    lines.push('6. [Timeline (Gantt Chart)](#timeline-gantt-chart)');
    lines.push('');
    lines.push('---');
    lines.push('');

    // EXECUTIVE SUMMARY
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`**Total Sprints**: ${pm.sprints.length} (${pm.sprints.length * 2} weeks)`);
    lines.push(`**Total Tasks**: ${pm.taskBreakdown.length}`);
    lines.push(`**Total Story Points**: ${pm.taskBreakdown.reduce((sum, t) => sum + t.storyPoints, 0)}`);
    lines.push(`**Project Duration**: ${pm.criticalPath.totalDuration} days (${Math.ceil(pm.criticalPath.totalDuration / 7)} weeks)`);
    lines.push(`**Buffer Days**: ${pm.criticalPath.bufferDays}`);
    lines.push(`**Team Size**: ${pm.teamAllocation.roles.length} members`);
    lines.push('');

    const utilizationWarning = pm.teamAllocation.roles.some(r => r.utilizationPercentage > 80);
    if (utilizationWarning) {
        lines.push('⚠️ **WARNING**: Some team members are over-allocated (>80% utilization). Consider:');
        lines.push('- Adding buffer time to sprints');
        lines.push('- Reducing scope of non-critical features');
        lines.push('- Adding team members if budget allows');
        lines.push('');
    }

    lines.push('---');
    lines.push('');

    // SPRINT OVERVIEW
    lines.push('## Sprint Overview');
    lines.push('');
    lines.push('| Sprint | Start Date | End Date | Story Points | Tasks | Goal |');
    lines.push('|--------|------------|----------|--------------|-------|------|');

    for (const sprint of pm.sprints) {
        lines.push(`| Sprint ${sprint.sprintNumber} | ${sprint.startDate} | ${sprint.endDate} | ${sprint.storyPoints} | ${sprint.tasks.length} | ${sprint.goal} |`);
    }
    lines.push('');

    // DETAILED SPRINT BREAKDOWN
    for (const sprint of pm.sprints) {
        lines.push(`### Sprint ${sprint.sprintNumber}: ${sprint.goal}`);
        lines.push('');
        lines.push(`**Duration**: ${sprint.startDate} → ${sprint.endDate}`);
        lines.push(`**Story Points**: ${sprint.storyPoints}`);
        lines.push('');

        // Tasks in this sprint
        const sprintTasks = pm.taskBreakdown.filter(t => sprint.tasks.includes(t.id));
        
        lines.push('**Tasks**:');
        lines.push('');
        lines.push('| Task ID | Title | Type | Assigned Role | Est. Hours | Priority | Status |');
        lines.push('|---------|-------|------|---------------|------------|----------|--------|');

        for (const task of sprintTasks) {
            lines.push(`| ${task.id} | ${task.title} | ${task.type} | ${task.assignedRole} | ${task.estimatedHours}h | ${task.priority} | ${task.status} |`);
        }
        lines.push('');

        // Milestones
        if (sprint.milestones.length > 0) {
            lines.push('**Milestones**:');
            sprint.milestones.forEach(milestone => {
                lines.push(`- **${milestone.name}** (${milestone.dueDate})`);
                lines.push(`  - ${milestone.description}`);
                milestone.deliverables.forEach(deliverable => {
                    lines.push(`  - ✅ ${deliverable}`);
                });
            });
            lines.push('');
        }
    }

    lines.push('---');
    lines.push('');

    // TASK BREAKDOWN (Full details)
    lines.push('## Task Breakdown');
    lines.push('');

    const tasksByType = groupBy(pm.taskBreakdown, 'type');

    for (const [type, tasks] of Object.entries(tasksByType)) {
        lines.push(`### ${type.toUpperCase()} Tasks`);
        lines.push('');

        for (const task of tasks) {
            lines.push(`#### ${task.id}: ${task.title}`);
            lines.push('');
            lines.push(`- **Description**: ${task.description}`);
            lines.push(`- **Assigned Role**: ${task.assignedRole}`);
            lines.push(`- **Priority**: ${task.priority}`);
            lines.push(`- **Estimated Hours**: ${task.estimatedHours}h (${task.storyPoints} story points)`);
            lines.push(`- **Sprint**: Sprint ${task.sprint}`);
            lines.push(`- **Status**: ${task.status}`);
            
            if (task.dependencies.length > 0) {
                lines.push(`- **Dependencies**: ${task.dependencies.join(', ')}`);
            }
            
            lines.push('- **Acceptance Criteria**:');
            task.acceptanceCriteria.forEach(ac => lines.push(`  - [ ] ${ac}`));
            lines.push('');
        }
    }

    lines.push('---');
    lines.push('');

    // TEAM ALLOCATION
    lines.push('## Team Allocation');
    lines.push('');
    lines.push('| Role | Tasks Assigned | Total Hours | Utilization | Status |');
    lines.push('|------|----------------|-------------|-------------|--------|');

    for (const member of pm.teamAllocation.roles) {
        const status = member.utilizationPercentage > 80 ? '⚠️ Over-allocated' : 
                       member.utilizationPercentage > 60 ? '✅ Well-balanced' : 
                       '⚠️ Under-utilized';
        lines.push(`| ${member.role} | ${member.assignedTasks.length} | ${member.totalHours}h | ${member.utilizationPercentage}% | ${status} |`);
    }
    lines.push('');

    // Workload chart per sprint
    lines.push('### Workload Distribution by Sprint');
    lines.push('');
    lines.push('| Sprint | ' + pm.teamAllocation.roles.map(r => r.role).join(' | ') + ' |');
    lines.push('|--------|-' + pm.teamAllocation.roles.map(() => '--------').join('-|-') + '-|');

    for (const workload of pm.teamAllocation.workloadChart) {
        const row = [
            `Sprint ${workload.sprintNumber}`,
            ...pm.teamAllocation.roles.map(r => `${workload.roleWorkload[r.role] || 0}h`)
        ];
        lines.push('| ' + row.join(' | ') + ' |');
    }
    lines.push('');

    lines.push('---');
    lines.push('');

    // CRITICAL PATH
    lines.push('## Critical Path Analysis');
    lines.push('');
    lines.push(`**Total Duration**: ${pm.criticalPath.totalDuration} days`);
    lines.push(`**Buffer Time**: ${pm.criticalPath.bufferDays} days (${Math.round((pm.criticalPath.bufferDays / pm.criticalPath.totalDuration) * 100)}% slack)`);
    lines.push('');
    lines.push('**Critical Tasks** (on longest dependency chain):');
    lines.push('');

    const criticalTasks = pm.taskBreakdown.filter(t => pm.criticalPath.criticalTasks.includes(t.id));
    criticalTasks.forEach(task => {
        lines.push(`- **${task.id}**: ${task.title} (${task.estimatedHours}h, Sprint ${task.sprint})`);
    });
    lines.push('');

    if (pm.criticalPath.bufferDays < 5) {
        lines.push('⚠️ **WARNING**: Critical path has minimal buffer. Risks:');
        lines.push('- Any delay in critical tasks will push deadline');
        lines.push('- Consider parallelizing tasks where possible');
        lines.push('- Add buffer sprints if timeline allows');
        lines.push('');
    }

    lines.push('---');
    lines.push('');

    // GANTT CHART
    lines.push('## Timeline (Gantt Chart)');
    lines.push('');
    lines.push(pm.ganttChart);
    lines.push('');

    lines.push('---');
    lines.push('');
    lines.push(`*Generated by MCP SSDLC Toolkit on ${new Date().toISOString().split('T')[0]}*`);

    return lines.join('\n');
}

/**
 * Generate Risk Register Markdown document
 */
function generateRiskRegisterMarkdown(risks: any[], projectName: string): string {
    const lines: string[] = [];

    lines.push(`# RISK REGISTER: ${projectName.toUpperCase()}`);
    lines.push('');
    lines.push(`**Generated**: ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // EXECUTIVE SUMMARY
    lines.push('## Executive Summary');
    lines.push('');
    const criticalRisks = risks.filter(r => r.impact === 'critical').length;
    const highRisks = risks.filter(r => r.impact === 'high').length;
    lines.push(`**Total Risks Identified**: ${risks.length}`);
    lines.push(`**Critical Risks**: ${criticalRisks}`);
    lines.push(`**High Risks**: ${highRisks}`);
    lines.push('');

    if (criticalRisks > 0) {
        lines.push('🔴 **URGENT ACTION REQUIRED**: Critical risks must be addressed immediately.');
        lines.push('');
    }

    lines.push('---');
    lines.push('');

    // RISK MATRIX
    lines.push('## Risk Matrix');
    lines.push('');
    lines.push('| Risk ID | Category | Description | Probability | Impact | Risk Score | Status |');
    lines.push('|---------|----------|-------------|-------------|--------|------------|--------|');

    // Sort by risk score descending
    const sortedRisks = [...risks].sort((a, b) => b.riskScore - a.riskScore);

    for (const risk of sortedRisks) {
        const emoji = risk.impact === 'critical' ? '🔴' : 
                      risk.impact === 'high' ? '🟠' : 
                      risk.impact === 'medium' ? '🟡' : '🟢';
        lines.push(`| ${risk.id} | ${risk.category} | ${risk.description.slice(0, 60)}... | ${risk.probability} | ${emoji} ${risk.impact} | ${risk.riskScore.toFixed(1)} | ${risk.status} |`);
    }
    lines.push('');

    lines.push('---');
    lines.push('');

    // DETAILED RISK BREAKDOWN
    lines.push('## Detailed Risk Analysis');
    lines.push('');

    for (const risk of sortedRisks) {
        const emoji = risk.impact === 'critical' ? '🔴' : 
                      risk.impact === 'high' ? '🟠' : 
                      risk.impact === 'medium' ? '🟡' : '🟢';
        
        lines.push(`### ${emoji} ${risk.id}: ${risk.description}`);
        lines.push('');
        lines.push(`**Category**: ${risk.category}`);
        lines.push(`**Probability**: ${risk.probability}`);
        lines.push(`**Impact**: ${risk.impact}`);
        lines.push(`**Risk Score**: ${risk.riskScore.toFixed(1)}/9`);
        lines.push(`**Owner**: ${risk.owner}`);
        lines.push(`**Status**: ${risk.status}`);
        lines.push('');
        lines.push('**Mitigation Strategy**:');
        lines.push(risk.mitigation);
        lines.push('');
        lines.push('**Contingency Plan**:');
        lines.push(risk.contingencyPlan);
        lines.push('');
        lines.push('---');
        lines.push('');
    }

    lines.push(`*Generated by MCP SSDLC Toolkit on ${new Date().toISOString().split('T')[0]}*`);

    return lines.join('\n');
}

/**
 * Helper: Group array by property
 */
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const group = String(item[key]);
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {} as Record<string, T[]>);
}