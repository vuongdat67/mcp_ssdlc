// Tech Lead Tool - Feature Checklist Generator
import type { Feature, SubFeature } from '../../types/tech-lead.js';

export interface UserStory {
    id: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
    priority?: string;
    acceptanceCriteria?: string[];
}

/**
 * Generate feature checklist from user stories
 */
export function generateFeatureChecklist(
    userStories: UserStory[],
    securityRequirements: string[] = []
): Feature[] {
    const features: Feature[] = [];
    let featureId = 1;

    // Group user stories by theme/module
    const storyGroups = groupStoriesByTheme(userStories);

    for (const [theme, stories] of Object.entries(storyGroups)) {
        const feature: Feature = {
            id: `F-${String(featureId).padStart(3, '0')}`,
            name: theme,
            priority: determinePriority(stories),
            description: `Feature group: ${theme}`,
            dependencies: [],
            subFeatures: []
        };

        // Add sub-features from user stories
        let subId = 1;
        for (const story of stories) {
            feature.subFeatures.push({
                id: `${feature.id}-${subId}`,
                name: story.title,
                parentId: feature.id
            });
            subId++;
        }

        features.push(feature);
        featureId++;
    }

    // Add security features
    if (securityRequirements.length > 0) {
        const securityFeature: Feature = {
            id: `F-${String(featureId).padStart(3, '0')}`,
            name: 'Security Controls',
            priority: 'P0',
            description: 'Security-related features and controls',
            dependencies: [],
            subFeatures: securityRequirements.map((req, idx) => ({
                id: `F-${String(featureId).padStart(3, '0')}-${idx + 1}`,
                name: req,
                parentId: `F-${String(featureId).padStart(3, '0')}`
            }))
        };
        features.push(securityFeature);
    }

    return features;
}

/**
 * Group stories by common themes/modules
 */
function groupStoriesByTheme(stories: UserStory[]): Record<string, UserStory[]> {
    const groups: Record<string, UserStory[]> = {};

    const themeKeywords: Record<string, string[]> = {
        'Authentication & Authorization': ['login', 'auth', 'password', 'mfa', 'permission', 'role', 'access'],
        'User Management': ['user', 'profile', 'account', 'registration', 'signup'],
        'Data Management': ['data', 'record', 'store', 'database', 'crud', 'create', 'update', 'delete'],
        'API & Integration': ['api', 'integration', 'external', 'third-party', 'webhook'],
        'Reporting & Analytics': ['report', 'analytics', 'dashboard', 'metric', 'statistic'],
        'Notifications': ['notification', 'alert', 'email', 'sms', 'push'],
        'Core Business Logic': [] // fallback
    };

    for (const story of stories) {
        const storyText = `${story.title} ${story.iWant} ${story.soThat}`.toLowerCase();
        let assigned = false;

        for (const [theme, keywords] of Object.entries(themeKeywords)) {
            if (keywords.length === 0) continue;

            for (const keyword of keywords) {
                if (storyText.includes(keyword)) {
                    if (!groups[theme]) groups[theme] = [];
                    groups[theme].push(story);
                    assigned = true;
                    break;
                }
            }
            if (assigned) break;
        }

        if (!assigned) {
            if (!groups['Core Business Logic']) groups['Core Business Logic'] = [];
            groups['Core Business Logic'].push(story);
        }
    }

    return groups;
}

/**
 * Determine feature priority based on story priorities
 */
function determinePriority(stories: UserStory[]): 'P0' | 'P1' | 'P2' | 'P3' {
    const priorities = stories.map(s => s.priority?.toLowerCase() || 'p2');

    if (priorities.some(p => p.includes('0') || p.includes('critical') || p.includes('high'))) {
        return 'P0';
    }
    if (priorities.some(p => p.includes('1') || p.includes('medium'))) {
        return 'P1';
    }
    return 'P2';
}
