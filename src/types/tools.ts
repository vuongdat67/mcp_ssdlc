// BA Types
export interface UserStory {
    id: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    acceptanceCriteria: string[];
    securityConsiderations: string[];
    estimatedEffort: 'Small' | 'Medium' | 'Large' | 'XLarge';
}

export interface SecurityRequirement {
    id: string;
    category: string;
    requirement: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    complianceMapping?: string[];
}

export interface AbuseCase {
    id: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string;
}

export interface BAOutput {
    projectName: string;
    userStories: UserStory[];
    securityRequirements: SecurityRequirement[];
    abuseCases: AbuseCase[];
    dataClassification: DataClassificationResult;
}

export interface DataClassificationResult {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
}

// Security Types
export interface Threat {
    id: string;
    category: 'Spoofing' | 'Tampering' | 'Repudiation' | 'Information Disclosure' | 'Denial of Service' | 'Elevation of Privilege';
    name: string;
    description: string;
    targetComponent: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    cwe?: string;
    owasp?: string;
    mitigation: string[];
}

export interface SecurityOutput {
    threats: Threat[];
    riskMatrix: RiskMatrixItem[];
    recommendations: string[];
}

export interface RiskMatrixItem {
    threatId: string;
    likelihood: string;
    impact: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
}

// QA Types
export interface TestCase {
    id: string;
    category: string;
    title: string;
    relatedTo: string; // Feature ID or Threat ID
    priority: 'critical' | 'high' | 'medium' | 'low';
    testSteps: string[];
    expectedResult: string;
    automated: boolean;
    toolsRequired: string[];
}

export interface QAOutput {
    testCases: TestCase[];
    penetrationTestPlan: PenTestPhase[];
    automationCoverage: AutomationCoverage;
}

export interface PenTestPhase {
    phase: string;
    duration: string;
    activities: string[];
}

export interface AutomationCoverage {
    totalTests: number;
    automated: number;
    manual: number;
    percentage: number;
}
