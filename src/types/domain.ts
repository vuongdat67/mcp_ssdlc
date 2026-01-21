// Domain Types - Expert Mode
export interface Domain {
    name: string;
    keywords: string[];
    knowledgeBase?: string[];
    architecturePatterns?: string[];
    securityStandards?: string[];
    stakeholders: Stakeholder[];
    sensitiveData: SensitiveData[];
    dataClassification: DataClassification;
}

export interface Stakeholder {
    name: string;
    type: 'end_user' | 'professional' | 'internal' | 'governance' | 'business_partner';
    dataAccess: string;
}

export interface SensitiveData {
    type: string;
    level: 'critical' | 'high' | 'medium' | 'low';
    encryption: 'required' | 'recommended' | 'optional';
}

export interface DataClassification {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
}

// Compliance Types
export interface ComplianceRequirement {
    id: string;
    name: string;
    description: string;
}

export interface Regulation {
    name: string;
    fullName: string;
    requirements: ComplianceRequirement[];
}

// Threat Types
export interface DomainThreat {
    id: string;
    category: 'Spoofing' | 'Tampering' | 'Repudiation' | 'Information Disclosure' | 'Denial of Service' | 'Elevation of Privilege';
    name: string;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string;
    complianceImpact?: string;
}
