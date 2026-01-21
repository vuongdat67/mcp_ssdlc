#!/usr/bin/env node
// MCP SSDLC Toolkit v2.0 - MCP Server Entry Point
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { loadDomain, loadDomainAuto, listDomains } from './domains/index.js';
import { techLeadDesign, type UserStory } from './tools/tech-lead/index.js';
import { analyzeRequirements } from './tools/ba/index.js';
import { generateThreatModel } from './tools/security/index.js';
import { designTestStrategy } from './tools/qa/index.js';
import { designCICD } from './tools/devops/index.js';
import { orchestratePipeline, type PipelineInput } from './orchestrator/index.js';
import { toJSON, toYAML, toMarkdown } from './exporters/index.js';

export const VERSION = '2.0.0';

// Create MCP server
const server = new Server(
    {
        name: 'mcp-ssdlc-toolkit',
        version: VERSION,
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // Domain tools
            {
                name: 'list_domains',
                description: 'List all available domain plugins',
                inputSchema: { type: 'object', properties: {} },
            },
            {
                name: 'load_domain',
                description: 'Load a specific domain plugin',
                inputSchema: {
                    type: 'object',
                    properties: {
                        domain_name: { type: 'string', description: 'Domain name (healthcare, fintech, generic)' },
                    },
                    required: ['domain_name'],
                },
            },
            {
                name: 'detect_domain',
                description: 'Auto-detect domain from project description',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_description: { type: 'string' },
                    },
                    required: ['project_description'],
                },
            },

            // BA Tool
            {
                name: 'ba_analyze_requirements',
                description: 'Generate user stories, security requirements, and abuse cases',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_description: { type: 'string' },
                        business_goals: { type: 'array', items: { type: 'string' } },
                        domain_name: { type: 'string', description: 'Optional domain name' },
                    },
                    required: ['project_description', 'business_goals'],
                },
            },

            // Tech Lead Tool
            {
                name: 'techlead_design',
                description: 'Generate feature checklist, flows, modules, pseudocode, architecture diagram',
                inputSchema: {
                    type: 'object',
                    properties: {
                        user_stories: { type: 'array', items: { type: 'object' } },
                        security_requirements: { type: 'array', items: { type: 'string' } },
                        target_language: { type: 'string', enum: ['python', 'typescript', 'java', 'go', 'csharp'] },
                        project_name: { type: 'string' },
                        export_format: { type: 'string', enum: ['json', 'yaml', 'markdown'] },
                    },
                },
            },

            // Security Tool
            {
                name: 'security_threat_model',
                description: 'Generate STRIDE threat model from modules',
                inputSchema: {
                    type: 'object',
                    properties: {
                        modules: { type: 'array', items: { type: 'object' } },
                        domain_name: { type: 'string' },
                        project_name: { type: 'string' },
                    },
                },
            },

            // QA Tool
            {
                name: 'qa_design_test_strategy',
                description: 'Generate test cases from features and threats',
                inputSchema: {
                    type: 'object',
                    properties: {
                        features: { type: 'array', items: { type: 'object' } },
                        threats: { type: 'array', items: { type: 'object' } },
                        compliance_requirements: { type: 'array', items: { type: 'string' } },
                    },
                },
            },

            // DevOps Tool
            {
                name: 'devops_design_cicd',
                description: 'Generate CI/CD pipeline with security gates',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_name: { type: 'string' },
                        tech_stack: { type: 'array', items: { type: 'string' } },
                        deployment_target: { type: 'string', enum: ['kubernetes', 'aws', 'azure', 'gcp', 'docker'] },
                        repository_platform: { type: 'string', enum: ['github', 'gitlab', 'bitbucket'] },
                    },
                },
            },

            // Orchestrator
            {
                name: 'orchestrate_ssdlc_pipeline',
                description: 'Run complete SSDLC pipeline from project description',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_description: { type: 'string' },
                        business_goals: { type: 'array', items: { type: 'string' } },
                        tech_stack: { type: 'array', items: { type: 'string' } },
                        target_language: { type: 'string', enum: ['python', 'typescript', 'java', 'go', 'csharp', 'cpp', 'rust'] },
                        deployment_target: { type: 'string', enum: ['kubernetes', 'aws', 'azure', 'gcp', 'docker'] },
                        compliance_requirements: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['project_description', 'business_goals', 'tech_stack'],
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        let result: unknown;

        switch (name) {
            case 'list_domains':
                result = { domains: listDomains() };
                break;

            case 'load_domain':
                result = await loadDomain((args as any).domain_name);
                break;

            case 'detect_domain':
                result = await loadDomainAuto((args as any).project_description);
                break;

            case 'ba_analyze_requirements': {
                const typedArgs = args as any;
                const domain = typedArgs.domain_name
                    ? await loadDomain(typedArgs.domain_name)
                    : await loadDomainAuto(typedArgs.project_description);
                result = analyzeRequirements({
                    projectDescription: typedArgs.project_description,
                    businessGoals: typedArgs.business_goals,
                    domain
                });
                break;
            }

            case 'techlead_design': {
                const typedArgs = args as any;
                const userStories: UserStory[] = (typedArgs.user_stories || []).map((s: any) => ({
                    id: s.id || 'US-001',
                    title: s.title || '',
                    asA: s.as_a || '',
                    iWant: s.i_want || '',
                    soThat: s.so_that || '',
                    priority: s.priority,
                }));
                result = await techLeadDesign({
                    userStories,
                    securityRequirements: typedArgs.security_requirements,
                    targetLanguage: typedArgs.target_language || 'python',
                    projectName: typedArgs.project_name,
                });
                break;
            }

            case 'security_threat_model': {
                const typedArgs = args as any;
                const domain = typedArgs.domain_name
                    ? await loadDomain(typedArgs.domain_name)
                    : undefined;
                result = generateThreatModel({
                    modules: typedArgs.modules || [],
                    domain,
                    projectName: typedArgs.project_name
                });
                break;
            }

            case 'qa_design_test_strategy': {
                const typedArgs = args as any;
                result = designTestStrategy({
                    features: typedArgs.features || [],
                    threats: typedArgs.threats || [],
                    complianceRequirements: typedArgs.compliance_requirements
                });
                break;
            }

            case 'devops_design_cicd': {
                const typedArgs = args as any;
                result = designCICD({
                    projectName: typedArgs.project_name || 'Project',
                    techStack: typedArgs.tech_stack || [],
                    deploymentTarget: typedArgs.deployment_target || 'kubernetes',
                    repositoryPlatform: typedArgs.repository_platform || 'github'
                });
                break;
            }

            case 'orchestrate_ssdlc_pipeline': {
                const typedArgs = args as any;
                const pipelineInput: PipelineInput = {
                    projectDescription: typedArgs.project_description,
                    businessGoals: typedArgs.business_goals,
                    techStack: typedArgs.tech_stack,
                    targetLanguage: typedArgs.target_language,
                    deploymentTarget: typedArgs.deployment_target,
                    complianceRequirements: typedArgs.compliance_requirements
                };
                result = await orchestratePipeline(pipelineInput);
                break;
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }

        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
    } catch (error) {
        return {
            content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`MCP SSDLC Toolkit v${VERSION} started`);
}

main().catch(console.error);
