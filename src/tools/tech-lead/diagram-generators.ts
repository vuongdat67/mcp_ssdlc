/**
 * Diagram Generators - Data Flow Diagrams (DFD) and Entity Relationship Diagrams (ERD)
 * Generate Mermaid diagrams for system architecture visualization
 */

import type { Module, Feature } from '../../types/tech-lead.js';
import type { LoadedDomain } from '../../domains/loader.js';

// ==================== DATA FLOW DIAGRAMS ====================

export interface DFDInput {
    modules: Module[];
    features: Feature[];
    domain?: LoadedDomain;
}

export interface DFDOutput {
    level0: string; // Context diagram - system boundaries
    level1: string; // High-level processes
    level2: string; // Detailed process decomposition
}

/**
 * Generate all DFD levels (0, 1, 2)
 */
export function generateDataFlowDiagrams(input: DFDInput): DFDOutput {
    return {
        level0: generateDFDLevel0(input),
        level1: generateDFDLevel1(input),
        level2: generateDFDLevel2(input)
    };
}

/**
 * DFD Level 0 - Context Diagram
 * Shows system as a single process with external entities
 */
function generateDFDLevel0(input: DFDInput): string {
    const lines: string[] = [];
    
    lines.push('```mermaid');
    lines.push('flowchart TB');
    lines.push('    %% DFD Level 0 - Context Diagram');
    lines.push('');
    
    // System (center)
    lines.push('    System["🖥️ System<br/>(Main Application)"]');
    lines.push('');
    
    // External entities (actors from domain)
    const stakeholders = input.domain?.domain?.stakeholders || [];
    stakeholders.forEach((stakeholder, idx) => {
        const entityId = `Entity${idx + 1}`;
        lines.push(`    ${entityId}["👤 ${stakeholder.name}"]`);
    });
    
    // Add common external entities
    lines.push('    DB[("💾 Database")]');
    lines.push('    API["🌐 External APIs"]');
    lines.push('    Auth["🔐 Auth Service"]');
    lines.push('');
    
    // Data flows
    lines.push('    %% Data Flows');
    stakeholders.forEach((stakeholder, idx) => {
        const entityId = `Entity${idx + 1}`;
        const accessType = stakeholder.dataAccess || 'data';
        lines.push(`    ${entityId} -->|"Request ${accessType}"| System`);
        lines.push(`    System -->|"Return ${accessType}"| ${entityId}`);
    });
    
    lines.push('    System <-->|"CRUD operations"| DB');
    lines.push('    System -->|"API calls"| API');
    lines.push('    System <-->|"Auth tokens"| Auth');
    lines.push('');
    
    // Styling
    lines.push('    style System fill:#4A90E2,color:#fff,stroke:#2E5C8A');
    lines.push('    style DB fill:#50C878,color:#fff');
    lines.push('    style API fill:#FF6B6B,color:#fff');
    lines.push('    style Auth fill:#FFD93D,color:#333');
    lines.push('```');
    
    return lines.join('\n');
}

/**
 * DFD Level 1 - High-Level Processes
 * Decomposes system into major processes/modules
 */
function generateDFDLevel1(input: DFDInput): string {
    const lines: string[] = [];
    
    lines.push('```mermaid');
    lines.push('flowchart TB');
    lines.push('    %% DFD Level 1 - Major Processes');
    lines.push('');
    
    // External entities
    lines.push('    User["👤 User"]');
    lines.push('    DB[("💾 Database")]');
    lines.push('    Cache[("⚡ Cache")]');
    lines.push('');
    
    // Major processes from modules
    const processes = input.modules.slice(0, 6); // Limit to 6 for readability
    processes.forEach((module, idx) => {
        const processId = `P${idx + 1}`;
        const icon = getModuleIcon(module.type);
        lines.push(`    ${processId}["${icon} Process ${idx + 1}<br/>${module.name}"]`);
    });
    lines.push('');
    
    // Data flows between processes
    lines.push('    %% Data Flows');
    lines.push('    User -->|"Input data"| P1');
    
    processes.forEach((module, idx) => {
        const processId = `P${idx + 1}`;
        
        // Flow to database
        if (module.type === 'repository' || module.type === 'service') {
            lines.push(`    ${processId} <-->|"Data persistence"| DB`);
        }
        
        // Flow to cache
        if (module.type === 'service') {
            lines.push(`    ${processId} <-->|"Cache ops"| Cache`);
        }
        
        // Flow to next process
        if (idx < processes.length - 1) {
            lines.push(`    ${processId} -->|"Processed data"| P${idx + 2}`);
        }
    });
    
    lines.push(`    P${processes.length} -->|"Response"| User`);
    lines.push('');
    
    // Styling
    processes.forEach((_, idx) => {
        const processId = `P${idx + 1}`;
        lines.push(`    style ${processId} fill:#4A90E2,color:#fff`);
    });
    lines.push('    style DB fill:#50C878,color:#fff');
    lines.push('    style Cache fill:#FFB347,color:#333');
    lines.push('```');
    
    return lines.join('\n');
}

/**
 * DFD Level 2 - Detailed Process Decomposition
 * Shows internal details of a major process
 */
function generateDFDLevel2(input: DFDInput): string {
    const lines: string[] = [];
    
    lines.push('```mermaid');
    lines.push('flowchart TB');
    lines.push('    %% DFD Level 2 - Process 1 Decomposition (Example)');
    lines.push('');
    
    // Pick first service module for detailed breakdown
    const targetModule = input.modules.find(m => m.type === 'service') || input.modules[0];
    
    lines.push('    Input["📥 Input Data"]');
    lines.push('');
    
    // Sub-processes from classes/methods
    const classes = targetModule?.classes || [];
    classes.slice(0, 4).forEach((cls, idx) => {
        const subprocessId = `SP${idx + 1}`;
        lines.push(`    ${subprocessId}["⚙️ ${cls.name}<br/>${cls.purpose}"]`);
    });
    
    lines.push('');
    lines.push('    Validate["✅ Validation"]');
    lines.push('    Transform["🔄 Transform"]');
    lines.push('    Store[("💾 Data Store")]');
    lines.push('    Output["📤 Output"]');
    lines.push('');
    
    // Data flows
    lines.push('    %% Data Flows');
    lines.push('    Input -->|"Raw data"| Validate');
    lines.push('    Validate -->|"Valid data"| SP1');
    
    if (classes.length > 0) {
        classes.slice(0, 4).forEach((_, idx) => {
            const subprocessId = `SP${idx + 1}`;
            if (idx === 0) {
                lines.push(`    ${subprocessId} -->|"Business logic"| Transform`);
            } else if (idx < 3) {
                lines.push(`    SP${idx} -->|"Pass to next"| ${subprocessId}`);
            }
        });
    }
    
    lines.push('    Transform -->|"Formatted data"| Store');
    lines.push('    Store -->|"Stored result"| Output');
    lines.push('');
    
    // Error handling
    lines.push('    Validate -->|"Invalid"| Error["❌ Error Handler"]');
    lines.push('    Error -->|"Error response"| Output');
    lines.push('');
    
    // Styling
    lines.push('    style Validate fill:#50C878,color:#fff');
    lines.push('    style Transform fill:#4A90E2,color:#fff');
    lines.push('    style Store fill:#9B59B6,color:#fff');
    lines.push('    style Error fill:#E74C3C,color:#fff');
    lines.push('```');
    
    return lines.join('\n');
}

// ==================== ENTITY RELATIONSHIP DIAGRAMS ====================

export interface ERDInput {
    modules: Module[];
    domain?: LoadedDomain;
}

export interface ERDOutput {
    diagram: string; // Mermaid ER diagram
    entities: EntityDefinition[];
}

export interface EntityDefinition {
    name: string;
    attributes: AttributeDefinition[];
    relationships: RelationshipDefinition[];
}

export interface AttributeDefinition {
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
    isRequired?: boolean;
}

export interface RelationshipDefinition {
    targetEntity: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    description: string;
}

/**
 * Generate Entity Relationship Diagram
 */
export function generateEntityRelationshipDiagram(input: ERDInput): ERDOutput {
    // Extract entities from model modules
    const entities = extractEntitiesFromModules(input.modules);
    const diagram = buildERDiagram(entities, input.domain);
    
    return {
        diagram,
        entities
    };
}

/**
 * Extract entity definitions from modules
 */
function extractEntitiesFromModules(modules: Module[]): EntityDefinition[] {
    const entities: EntityDefinition[] = [];
    
    // Find model/entity classes
    const modelModules = modules.filter(m => m.type === 'model' || m.name.toLowerCase().includes('model'));
    
    modelModules.forEach(module => {
        module.classes.forEach(cls => {
            const entity: EntityDefinition = {
                name: cls.name.replace(/Model|Entity/gi, ''),
                attributes: cls.properties.map(prop => ({
                    name: prop.name,
                    type: prop.type,
                    isPrimaryKey: prop.name.toLowerCase() === 'id',
                    isRequired: true
                })),
                relationships: inferRelationships(cls.properties)
            };
            entities.push(entity);
        });
    });
    
    // If no models found, generate sample entities
    if (entities.length === 0) {
        entities.push(...generateSampleEntities());
    }
    
    return entities;
}

/**
 * Infer relationships from property names
 */
function inferRelationships(properties: any[]): RelationshipDefinition[] {
    const relationships: RelationshipDefinition[] = [];
    
    properties.forEach(prop => {
        const propName = prop.name.toLowerCase();
        
        // Foreign key pattern: userId, customerId, etc.
        if (propName.endsWith('id') && propName !== 'id') {
            const targetEntity = propName.replace('id', '').replace(/_/g, '');
            relationships.push({
                targetEntity: capitalize(targetEntity),
                type: 'one-to-many',
                description: `belongs to ${capitalize(targetEntity)}`
            });
        }
        
        // Array pattern: items, orders, etc.
        if (prop.type.includes('[]') || prop.type.includes('Array')) {
            const targetEntity = prop.name.replace(/s$/, ''); // Remove trailing 's'
            relationships.push({
                targetEntity: capitalize(targetEntity),
                type: 'one-to-many',
                description: `has many ${prop.name}`
            });
        }
    });
    
    return relationships;
}

/**
 * Build Mermaid ER diagram
 */
function buildERDiagram(entities: EntityDefinition[], domain?: LoadedDomain): string {
    const lines: string[] = [];
    
    lines.push('```mermaid');
    lines.push('erDiagram');
    lines.push('    %% Entity Relationship Diagram');
    lines.push('');
    
    // Define entities with attributes
    entities.forEach(entity => {
        lines.push(`    ${entity.name.toUpperCase()} {`);
        
        entity.attributes.forEach(attr => {
            const keyMarker = attr.isPrimaryKey ? 'PK' : attr.isForeignKey ? 'FK' : '';
            const required = attr.isRequired ? '' : 'nullable';
            lines.push(`        ${attr.type} ${attr.name} ${keyMarker} ${required}`.trim());
        });
        
        lines.push('    }');
        lines.push('');
    });
    
    // Define relationships
    entities.forEach(entity => {
        entity.relationships.forEach(rel => {
            const relationshipSymbol = getRelationshipSymbol(rel.type);
            lines.push(`    ${entity.name.toUpperCase()} ${relationshipSymbol} ${rel.targetEntity.toUpperCase()} : "${rel.description}"`);
        });
    });
    
    lines.push('```');
    
    return lines.join('\n');
}

/**
 * Generate sample entities for common domains
 */
function generateSampleEntities(): EntityDefinition[] {
    return [
        {
            name: 'User',
            attributes: [
                { name: 'id', type: 'uuid', isPrimaryKey: true, isRequired: true },
                { name: 'email', type: 'string', isRequired: true },
                { name: 'password_hash', type: 'string', isRequired: true },
                { name: 'created_at', type: 'timestamp', isRequired: true }
            ],
            relationships: [
                { targetEntity: 'Order', type: 'one-to-many', description: 'places' },
                { targetEntity: 'Profile', type: 'one-to-one', description: 'has' }
            ]
        },
        {
            name: 'Profile',
            attributes: [
                { name: 'id', type: 'uuid', isPrimaryKey: true, isRequired: true },
                { name: 'user_id', type: 'uuid', isForeignKey: true, isRequired: true },
                { name: 'first_name', type: 'string', isRequired: true },
                { name: 'last_name', type: 'string', isRequired: true },
                { name: 'phone', type: 'string', isRequired: false }
            ],
            relationships: [
                { targetEntity: 'User', type: 'one-to-one', description: 'belongs to' }
            ]
        },
        {
            name: 'Order',
            attributes: [
                { name: 'id', type: 'uuid', isPrimaryKey: true, isRequired: true },
                { name: 'user_id', type: 'uuid', isForeignKey: true, isRequired: true },
                { name: 'total_amount', type: 'decimal', isRequired: true },
                { name: 'status', type: 'enum', isRequired: true },
                { name: 'created_at', type: 'timestamp', isRequired: true }
            ],
            relationships: [
                { targetEntity: 'User', type: 'one-to-many', description: 'placed by' },
                { targetEntity: 'OrderItem', type: 'one-to-many', description: 'contains' }
            ]
        },
        {
            name: 'OrderItem',
            attributes: [
                { name: 'id', type: 'uuid', isPrimaryKey: true, isRequired: true },
                { name: 'order_id', type: 'uuid', isForeignKey: true, isRequired: true },
                { name: 'product_id', type: 'uuid', isForeignKey: true, isRequired: true },
                { name: 'quantity', type: 'int', isRequired: true },
                { name: 'unit_price', type: 'decimal', isRequired: true }
            ],
            relationships: [
                { targetEntity: 'Order', type: 'one-to-many', description: 'part of' },
                { targetEntity: 'Product', type: 'one-to-many', description: 'references' }
            ]
        },
        {
            name: 'Product',
            attributes: [
                { name: 'id', type: 'uuid', isPrimaryKey: true, isRequired: true },
                { name: 'name', type: 'string', isRequired: true },
                { name: 'description', type: 'text', isRequired: false },
                { name: 'price', type: 'decimal', isRequired: true },
                { name: 'stock_quantity', type: 'int', isRequired: true }
            ],
            relationships: [
                { targetEntity: 'OrderItem', type: 'one-to-many', description: 'ordered in' }
            ]
        }
    ];
}

// ==================== HELPER FUNCTIONS ====================

function getModuleIcon(type: string): string {
    const icons: Record<string, string> = {
        'service': '⚙️',
        'repository': '💾',
        'controller': '🎮',
        'utility': '🔧',
        'model': '📦'
    };
    return icons[type] || '📋';
}

function getRelationshipSymbol(type: 'one-to-one' | 'one-to-many' | 'many-to-many'): string {
    switch (type) {
        case 'one-to-one':
            return '||--||';
        case 'one-to-many':
            return '||--o{';
        case 'many-to-many':
            return '}o--o{';
        default:
            return '||--||';
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
