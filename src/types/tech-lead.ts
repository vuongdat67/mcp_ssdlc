// Tech Lead Output Types - QUAN TRỌNG NHẤT

// Feature Checklist
export interface Feature {
    id: string;
    name: string;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    description: string;
    dependencies: string[];
    subFeatures: SubFeature[];
}

export interface SubFeature {
    id: string;
    name: string;
    parentId: string;
}

// Feature Flow
export interface FeatureFlow {
    featureId: string;
    steps: FlowStep[];
}

export interface FlowStep {
    order: number;
    actor: string;
    action: string;
    notes?: string;
}

// Module Breakdown
export interface Module {
    name: string;
    type: 'service' | 'repository' | 'controller' | 'utility' | 'model';
    classes: ClassDefinition[];
    interfaces: InterfaceDefinition[];
    dependencies: string[];
}

export interface ClassDefinition {
    name: string;
    purpose: string;
    methods: MethodSignature[];
    properties: PropertyDefinition[];
}

export interface InterfaceDefinition {
    name: string;
    purpose: string;
    methods: MethodSignature[];
}

export interface MethodSignature {
    name: string;
    params: string;
    returns: string;
    description: string;
}

export interface PropertyDefinition {
    name: string;
    type: string;
    visibility: 'public' | 'private' | 'protected';
}

// Pseudocode - QUAN TRỌNG
export type PseudocodeLanguage = 'python' | 'typescript' | 'java' | 'go' | 'csharp' | 'cpp' | 'rust';
export interface PseudocodeFile {
    filename: string;
    module: string;
    language: PseudocodeLanguage;
    purpose: string;
    securityNotes: string[];
    content: string;   // The actual pseudocode
}

// File Structure
export interface FileStructure {
    name: string;
    type: 'file' | 'directory';
    path?: string;
    content?: string; // For files
    children?: FileStructure[]; // For directories
    description?: string;
}

// Design Patterns
export interface DesignPattern {
    name: string;
    description: string;
    justification: string;
    tradeoffs?: string[];
}

// Complete Tech Lead Output
export interface TechLeadOutput {
    features: Feature[];
    flows: FeatureFlow[];
    modules: Module[];
    pseudocode: PseudocodeFile[];
    architectureDiagram: string;
    fileStructure: FileStructure[];
    designPatterns: DesignPattern[];
}
