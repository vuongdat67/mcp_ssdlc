// Tech Lead Tool - Feature Flows Generator
import type { Feature, FeatureFlow, FlowStep } from '../../types/tech-lead.js';

/**
 * Generate feature flows (user journey / process flows)
 */
export function generateFeatureFlows(features: Feature[]): FeatureFlow[] {
    const flows: FeatureFlow[] = [];

    for (const feature of features) {
        const flow: FeatureFlow = {
            featureId: feature.id,
            steps: generateFlowSteps(feature)
        };
        flows.push(flow);
    }

    return flows;
}

/**
 * Generate flow steps based on feature type
 */
function generateFlowSteps(feature: Feature): FlowStep[] {
    const featureName = feature.name.toLowerCase();

    // Authentication flow
    if (featureName.includes('auth')) {
        return [
            { order: 1, actor: 'User', action: 'Navigate to login page' },
            { order: 2, actor: 'System', action: 'Display login form' },
            { order: 3, actor: 'User', action: 'Enter credentials' },
            { order: 4, actor: 'System', action: 'Validate input format', notes: 'Client-side validation' },
            { order: 5, actor: 'API', action: 'Verify credentials against database' },
            { order: 6, actor: 'System', action: 'Check if MFA required', notes: 'Based on user settings' },
            { order: 7, actor: 'System', action: 'Generate session token', notes: 'JWT with expiration' },
            { order: 8, actor: 'System', action: 'Return token to client' },
            { order: 9, actor: 'System', action: 'Log authentication event', notes: 'Audit trail' }
        ];
    }

    // User management flow
    if (featureName.includes('user')) {
        return [
            { order: 1, actor: 'Admin', action: 'Access user management' },
            { order: 2, actor: 'System', action: 'Verify admin permissions', notes: 'RBAC check' },
            { order: 3, actor: 'System', action: 'Load user list with pagination' },
            { order: 4, actor: 'Admin', action: 'Select action (create/edit/delete)' },
            { order: 5, actor: 'System', action: 'Display appropriate form' },
            { order: 6, actor: 'Admin', action: 'Submit changes' },
            { order: 7, actor: 'API', action: 'Validate and process request' },
            { order: 8, actor: 'System', action: 'Update database' },
            { order: 9, actor: 'System', action: 'Log action for audit' }
        ];
    }

    // Data management flow  
    if (featureName.includes('data') || featureName.includes('record')) {
        return [
            { order: 1, actor: 'User', action: 'Request data access' },
            { order: 2, actor: 'System', action: 'Authenticate user' },
            { order: 3, actor: 'System', action: 'Check authorization', notes: 'Role-based access' },
            { order: 4, actor: 'API', action: 'Query database' },
            { order: 5, actor: 'System', action: 'Apply data masking if needed', notes: 'For sensitive fields' },
            { order: 6, actor: 'System', action: 'Return data to client' },
            { order: 7, actor: 'System', action: 'Log data access', notes: 'Compliance audit' }
        ];
    }

    // Security controls flow
    if (featureName.includes('security')) {
        return [
            { order: 1, actor: 'System', action: 'Initialize security controls' },
            { order: 2, actor: 'System', action: 'Load security configuration' },
            { order: 3, actor: 'System', action: 'Apply input validation rules' },
            { order: 4, actor: 'System', action: 'Enable encryption at rest' },
            { order: 5, actor: 'System', action: 'Configure TLS for transit' },
            { order: 6, actor: 'System', action: 'Start audit logging' },
            { order: 7, actor: 'System', action: 'Initialize rate limiting' }
        ];
    }

    // Generic CRUD flow
    return [
        { order: 1, actor: 'User', action: 'Initiate action' },
        { order: 2, actor: 'System', action: 'Validate authentication' },
        { order: 3, actor: 'System', action: 'Check authorization' },
        { order: 4, actor: 'System', action: 'Validate input data' },
        { order: 5, actor: 'API', action: 'Process business logic' },
        { order: 6, actor: 'Database', action: 'Persist changes' },
        { order: 7, actor: 'System', action: 'Return response' },
        { order: 8, actor: 'System', action: 'Log action' }
    ];
}
