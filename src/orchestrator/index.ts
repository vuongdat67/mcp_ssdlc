// Pipeline Orchestrator - Connect all SSDLC phases
import type { LoadedDomain } from '../domains/loader.js';
import type { TechLeadOutput } from '../types/tech-lead.js';
import type { BAOutput, SecurityOutput, QAOutput } from '../types/tools.js';

import { loadDomainAuto } from '../domains/loader.js';
import { analyzeRequirements, type BAInput } from '../tools/ba/index.js';
import { techLeadDesign, type TechLeadInput } from '../tools/tech-lead/index.js';
import { generateThreatModel, type SecurityInput } from '../tools/security/index.js';
import { designTestStrategy, type QAInput } from '../tools/qa/index.js';
import { designCICD, type DevOpsInput, type DevOpsOutput } from '../tools/devops/index.js';

export interface PipelineInput {
    projectDescription: string;
    businessGoals: string[];
    techStack: string[];
    targetLanguage?: string;
    deploymentTarget?: 'kubernetes' | 'aws' | 'azure' | 'gcp' | 'docker';
    repositoryPlatform?: 'github' | 'gitlab' | 'bitbucket';
    complianceRequirements?: string[];
}

export interface PipelineOutput {
    orchestrationId: string;
    projectName: string;
    domain: LoadedDomain;
    phases: {
        ba: BAOutput;
        techLead: TechLeadOutput;
        security: SecurityOutput;
        qa: QAOutput;
        devops: DevOpsOutput;
    };
    summary: PipelineSummary;
}

export interface PipelineSummary {
    totalFeatures: number;
    totalModules: number;
    totalThreats: number;
    totalTestCases: number;
    criticalThreats: number;
    automationCoverage: number;
    complianceFrameworks: string[];
}

/**
 * Run complete SSDLC pipeline
 */
export async function orchestratePipeline(input: PipelineInput): Promise<PipelineOutput> {
    const {
        projectDescription,
        businessGoals,
        techStack,
        targetLanguage = 'python',
        deploymentTarget = 'kubernetes',
        repositoryPlatform = 'github',
        complianceRequirements = []
    } = input;

    // Generate orchestration ID
    const orchestrationId = `ssdlc-${Date.now()}`;

    // Phase 0: Detect domain
    const domain = await loadDomainAuto(projectDescription);

    // Phase 1: Business Analysis
    const baInput: BAInput = {
        projectDescription,
        businessGoals,
        domain
    };
    const baOutput = analyzeRequirements(baInput);

    // Phase 2: Tech Lead Design
    const techLeadInput: TechLeadInput = {
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
    };
    const techLeadOutput = await techLeadDesign(techLeadInput);

    // Phase 3: Security Threat Model
    const securityInput: SecurityInput = {
        modules: techLeadOutput.modules,
        domain,
        projectName: baOutput.projectName
    };
    const securityOutput = generateThreatModel(securityInput);

    // Phase 4: QA Test Strategy
    const qaInput: QAInput = {
        features: techLeadOutput.features,
        threats: securityOutput.threats,
        complianceRequirements: [
            ...complianceRequirements,
            ...(domain.compliance?.regulations.map(r => r.name) || [])
        ]
    };
    const qaOutput = designTestStrategy(qaInput);

    // Phase 5: DevOps CI/CD
    const devopsInput: DevOpsInput = {
        projectName: baOutput.projectName,
        techStack,
        deploymentTarget,
        repositoryPlatform
    };
    const devopsOutput = designCICD(devopsInput);

    // Generate summary
    const summary: PipelineSummary = {
        totalFeatures: techLeadOutput.features.length,
        totalModules: techLeadOutput.modules.length,
        totalThreats: securityOutput.threats.length,
        totalTestCases: qaOutput.testCases.length,
        criticalThreats: securityOutput.threats.filter(t => t.impact === 'critical').length,
        automationCoverage: qaOutput.automationCoverage.percentage,
        complianceFrameworks: domain.compliance?.regulations.map(r => r.name) || []
    };

    return {
        orchestrationId,
        projectName: baOutput.projectName,
        domain,
        phases: {
            ba: baOutput,
            techLead: techLeadOutput,
            security: securityOutput,
            qa: qaOutput,
            devops: devopsOutput
        },
        summary
    };
}
