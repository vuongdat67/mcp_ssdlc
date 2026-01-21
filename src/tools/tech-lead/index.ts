// Tech Lead Tool - Main Entry Point
import { generateFeatureChecklist, type UserStory } from './feature-checklist.js';
import { generateFeatureFlows } from './feature-flows.js';
import { generateModuleBreakdown } from './module-breakdown.js';
import { generatePseudocode, type PseudocodeLanguage } from './pseudocode-generator.js';
import { generateArchitectureDiagram, generateComponentDiagram } from './architecture-diagram.js';
import { generateProjectStructure } from './scaffold-structure.js';
import { generateDesignPatterns } from './design-patterns.js';
import { generateDataFlowDiagrams, generateEntityRelationshipDiagram } from './diagram-generators.js';
import type { TechLeadOutput, FileStructure } from '../../types/tech-lead.js';

// Export diagram generators for external use
export { generateDataFlowDiagrams, generateEntityRelationshipDiagram } from './diagram-generators.js';
export type { DFDInput, DFDOutput, ERDInput, ERDOutput } from './diagram-generators.js';

export interface TechLeadInput {
    userStories: UserStory[];
    securityRequirements?: string[];
    targetLanguage?: PseudocodeLanguage;
    projectName?: string;
    domainName?: string;
}

/**
 * Main Tech Lead tool - generates complete output
 */
export async function techLeadDesign(input: TechLeadInput): Promise<TechLeadOutput> {
    const {
        userStories,
        securityRequirements = [],
        targetLanguage = 'python',
        projectName = 'System',
        domainName
    } = input;

    // Step 1: Generate feature checklist
    const features = generateFeatureChecklist(userStories, securityRequirements);

    // Step 2: Generate feature flows
    const flows = generateFeatureFlows(features);

    // Step 3: Generate module breakdown
    const modules = generateModuleBreakdown(features, domainName);

    // Step 4: Generate pseudocode (QUAN TRỌNG)
    const pseudocode = generatePseudocode(modules, targetLanguage);

    // Step 5: Generate architecture diagram
    const architectureDiagram = generateArchitectureDiagram(modules, features, projectName);

    // Step 6: Generate project structure
    const fileStructure = generateProjectStructure(domainName);

    // Step 7: Generate design patterns
    const designPatterns = generateDesignPatterns(domainName);

    // Step 8: Generate data flow diagrams (DFD Level 0, 1, 2)
    const dataFlowDiagrams = generateDataFlowDiagrams({
        modules,
        features
    });

    // Step 9: Generate entity relationship diagram (ERD)
    const erdOutput = generateEntityRelationshipDiagram({ modules });

    return {
        features,
        flows,
        modules,
        pseudocode,
        architectureDiagram,
        fileStructure,
        designPatterns,
        dataFlowDiagrams,
        entityRelationshipDiagram: erdOutput.diagram
    };
}

// Re-export sub-modules
export { generateFeatureChecklist, type UserStory } from './feature-checklist.js';
export { generateFeatureFlows } from './feature-flows.js';
export { generateModuleBreakdown } from './module-breakdown.js';
export { generatePseudocode, type PseudocodeLanguage } from './pseudocode-generator.js';
export { generateArchitectureDiagram, generateComponentDiagram } from './architecture-diagram.js';
