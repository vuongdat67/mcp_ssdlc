// Tech Lead Tool - Architecture Diagram Generator (Mermaid)
import type { Module, Feature, FeatureFlow } from '../../types/tech-lead.js';

/**
 * Generate Mermaid architecture diagram
 */
export function generateArchitectureDiagram(
    modules: Module[],
    features: Feature[],
    projectName: string = 'System'
): string {
    const lines: string[] = [];

    lines.push('```mermaid');
    lines.push('graph TB');
    lines.push(`    subgraph ${sanitize(projectName)}`);
    lines.push('');

    // Client layer
    lines.push('    subgraph Client["Client Layer"]');
    lines.push('        UI[Web/Mobile UI]');
    lines.push('    end');
    lines.push('');

    // API layer
    lines.push('    subgraph API["API Layer"]');
    lines.push('        Gateway[API Gateway]');
    const controllers = modules.filter(m => m.classes.some(c => c.name.includes('Controller')));
    for (const mod of controllers) {
        lines.push(`        ${sanitize(mod.name)}[${mod.name}]`);
    }
    lines.push('    end');
    lines.push('');

    // Business layer
    lines.push('    subgraph Business["Business Layer"]');
    const services = modules.filter(m => m.type === 'service' && !m.name.includes('Security'));
    for (const mod of services) {
        lines.push(`        ${sanitize(mod.name)}Svc[${mod.name} Service]`);
    }
    lines.push('    end');
    lines.push('');

    // Security layer
    lines.push('    subgraph Security["Security Layer"]');
    lines.push('        Auth[AuthService]');
    lines.push('        Authz[AuthorizationService]');
    lines.push('    end');
    lines.push('');

    // Data layer
    lines.push('    subgraph Data["Data Layer"]');
    const repos = modules.filter(m => m.classes.some(c => c.name.includes('Repository')));
    for (const mod of repos) {
        lines.push(`        ${sanitize(mod.name)}Repo[${mod.name} Repository]`);
    }
    lines.push('        DB[(Database)]');
    lines.push('    end');
    lines.push('');
    lines.push('    end');
    lines.push('');

    // Connections
    lines.push('    %% Connections');
    lines.push('    UI --> Gateway');
    lines.push('    Gateway --> Auth');

    for (const mod of controllers) {
        lines.push(`    Gateway --> ${sanitize(mod.name)}`);
    }

    for (const mod of services) {
        lines.push(`    ${sanitize(mod.name)} --> ${sanitize(mod.name)}Svc`);
    }

    for (const mod of repos) {
        lines.push(`    ${sanitize(mod.name)}Svc --> ${sanitize(mod.name)}Repo`);
        lines.push(`    ${sanitize(mod.name)}Repo --> DB`);
    }

    lines.push('```');

    return lines.join('\n');
}

/**
 * Generate component diagram
 */
export function generateComponentDiagram(modules: Module[]): string {
    const lines: string[] = [];

    lines.push('```mermaid');
    lines.push('classDiagram');
    lines.push('');

    for (const module of modules) {
        for (const cls of module.classes) {
            lines.push(`    class ${cls.name} {`);

            for (const prop of cls.properties) {
                const visibility = prop.visibility === 'private' ? '-' : prop.visibility === 'protected' ? '#' : '+';
                lines.push(`        ${visibility}${prop.name}: ${prop.type}`);
            }

            for (const method of cls.methods) {
                lines.push(`        +${method.name}()`);
            }

            lines.push('    }');
            lines.push('');
        }

        for (const iface of module.interfaces) {
            lines.push(`    class ${iface.name} {`);
            lines.push(`        <<interface>>`);
            for (const method of iface.methods) {
                lines.push(`        +${method.name}()`);
            }
            lines.push('    }');
            lines.push('');
        }
    }

    // Dependencies
    for (const module of modules) {
        for (const dep of module.dependencies) {
            lines.push(`    ${module.name} --> ${dep}`);
        }
    }

    lines.push('```');

    return lines.join('\n');
}

/**
 * Generate sequence diagram for a feature flow
 */
export function generateSequenceDiagram(flow: FeatureFlow): string {
    const lines: string[] = [];

    lines.push('```mermaid');
    lines.push('sequenceDiagram');
    lines.push('');
    lines.push('    participant User');
    lines.push('    participant UI');
    lines.push('    participant API');
    lines.push('    participant Service');
    lines.push('    participant DB');
    lines.push('');

    let lastActor = 'User';
    for (const step of flow.steps) {
        const actor = mapActor(step.actor);
        const target = getNextActor(actor);

        if (step.notes) {
            lines.push(`    Note over ${actor}: ${step.notes}`);
        }

        lines.push(`    ${lastActor}->>+${actor}: ${step.action}`);
        lastActor = actor;
    }

    lines.push('```');

    return lines.join('\n');
}

function sanitize(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '');
}

function mapActor(actor: string): string {
    const lower = actor.toLowerCase();
    if (lower.includes('user') || lower.includes('admin')) return 'User';
    if (lower.includes('ui') || lower.includes('system')) return 'UI';
    if (lower.includes('api')) return 'API';
    if (lower.includes('database') || lower.includes('db')) return 'DB';
    return 'Service';
}

function getNextActor(current: string): string {
    const order = ['User', 'UI', 'API', 'Service', 'DB'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : current;
}
