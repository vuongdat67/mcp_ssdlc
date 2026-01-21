// Comprehensive test of enhanced pipeline with ADR generator
import { orchestrateEnhancedPipeline } from './dist/orchestrator/enhanced-pipeline.js';
import { writeFileSync } from 'fs';

async function testEnhancedPipeline() {
    console.log('🚀 Testing Enhanced SSDLC Pipeline with ADR Generator...\n');

    const result = await orchestrateEnhancedPipeline({
        projectDescription: 'Secure messaging application with end-to-end encryption using Signal Protocol',
        businessGoals: [
            'Provide military-grade security for private communications',
            'Support multi-device per user',
            'Ensure GDPR compliance',
            'Scale to 100k active users'
        ],
        techStack: ['Rust', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
        targetLanguage: 'rust',
        deploymentTarget: 'kubernetes',
        repositoryPlatform: 'github',
        complianceRequirements: ['GDPR', 'ePrivacy Directive']
    });

    console.log('✅ Pipeline completed!\n');
    console.log('📊 Results Summary:');
    console.log('='.repeat(70));
    console.log(`Project: ${result.projectName}`);
    console.log(`Domain: ${result.domain.name}`);
    console.log('');

    console.log('📋 Phase 1: Business Analysis');
    console.log(`   - User Stories: ${result.phases.ba.userStories.length}`);
    console.log(`   - Security Requirements: ${result.phases.ba.securityRequirements.length}`);
    console.log('');

    console.log('🏗️  Phase 2: Technical Design');
    console.log(`   - Modules: ${result.phases.techLead.modules.length}`);
    console.log(`   - Features: ${result.phases.techLead.features.length}`);
    console.log(`   - Pseudocode Files: ${result.phases.techLead.pseudocode.length}`);
    console.log('');

    console.log('🔒 Phase 3: Security Threat Modeling');
    console.log(`   - Total Threats: ${result.phases.security.threats.length}`);
    console.log(`   - Critical Threats: ${result.summary.criticalThreats}`);
    console.log('');

    console.log('✅ Phase 4: QA Test Strategy');
    console.log(`   - Test Cases: ${result.phases.qa.testCases.length}`);
    console.log(`   - Automation Coverage: ${result.summary.automationCoverage}%`);
    console.log('');

    console.log('🔧 Phase 5: DevOps CI/CD');
    console.log(`   - Pipeline Stages: ${result.phases.devops.pipelineStages.length}`);
    console.log(`   - Security Gates: ${result.phases.devops.securityGates.length}`);
    console.log('');

    console.log('📊 Phase 6: Project Management');
    console.log(`   - Sprints: ${result.phases.pm.sprints.length}`);
    console.log(`   - Tasks: ${result.phases.pm.taskBreakdown.length}`);
    console.log(`   - Critical Path Duration: ${result.phases.pm.criticalPath.totalDuration} days`);
    console.log(`   - Risks Identified: ${result.phases.pm.riskRegister.length}`);
    console.log('');

    console.log('🏛️  Phase 7: Architecture Decision Records');
    console.log(`   - Total ADRs: ${result.phases.architecture.decisions.length}`);
    console.log(`   - Accepted Decisions: ${result.phases.architecture.summary.acceptedDecisions}`);
    console.log(`   - High-Risk Decisions: ${result.phases.architecture.summary.highRiskDecisions.length}`);
    console.log('');

    console.log('📝 ADR Details:');
    result.phases.architecture.decisions.forEach((adr, i) => {
        console.log(`   ${i + 1}. ${adr.id}: ${adr.title}`);
        console.log(`      - Status: ${adr.status}`);
        console.log(`      - Options Evaluated: ${adr.options.length}`);
        console.log(`      - Compliance Impact: ${adr.complianceImpact?.join(', ') || 'None'}`);
    });
    console.log('');

    console.log('📄 Deliverables:');
    console.log('='.repeat(70));
    console.log(`   - ADR Documents: ${result.deliverables.adrDocuments.length}`);
    console.log(`   - Project Plan: ${result.deliverables.projectPlan.length} characters`);
    console.log(`   - Risk Register: ${result.deliverables.riskRegister.length} characters`);
    console.log('');

    // Save ADRs to files
    console.log('💾 Saving ADR documents...');
    result.deliverables.adrDocuments.forEach((adrMarkdown, i) => {
        const adr = result.phases.architecture.decisions[i];
        const filename = `./ADR-${String(i + 1).padStart(3, '0')}-${adr.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
        writeFileSync(filename, adrMarkdown);
        console.log(`   ✅ ${filename}`);
    });
    console.log('');

    // Save Project Plan
    console.log('💾 Saving Project Plan...');
    writeFileSync('./PROJECT-PLAN.md', result.deliverables.projectPlan);
    console.log('   ✅ PROJECT-PLAN.md');
    console.log('');

    // Save Risk Register
    console.log('💾 Saving Risk Register...');
    writeFileSync('./RISK-REGISTER.md', result.deliverables.riskRegister);
    console.log('   ✅ RISK-REGISTER.md');
    console.log('');

    console.log('🎉 Enhanced Pipeline Test Complete!');
    console.log('');
    console.log('📁 Generated Files:');
    console.log(`   - ${result.deliverables.adrDocuments.length} ADR documents`);
    console.log(`   - 1 Project Plan`);
    console.log(`   - 1 Risk Register`);
    console.log('');
    console.log('✨ All deliverables saved successfully!');
}

testEnhancedPipeline().catch(console.error);
