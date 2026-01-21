// Project Manager Tool - Sprint Planning, Task Breakdown, Risk Management
import type { Feature } from '../../types/tech-lead.js';
import type { Threat } from '../../types/tools.js';

export interface PMInput {
    features: Feature[];
    threats: Threat[];
    teamSize: number;
    sprintDuration: number; // weeks (typically 2)
    projectStartDate: string; // ISO date
}

export interface PMOutput {
    sprints: SprintPlan[];
    taskBreakdown: Task[];
    teamAllocation: TeamAllocation;
    criticalPath: CriticalPathAnalysis;
    riskRegister: RiskItem[];
    ganttChart: string; // Mermaid gantt diagram
}

export interface SprintPlan {
    sprintNumber: number;
    startDate: string;
    endDate: string;
    goal: string;
    tasks: string[]; // Task IDs
    storyPoints: number;
    milestones: Milestone[];
}

export interface Task {
    id: string; // "TASK-001"
    title: string;
    description: string;
    type: 'design' | 'development' | 'testing' | 'security' | 'documentation' | 'devops';
    assignedRole: string; // "Backend Dev", "Security Engineer"
    estimatedHours: number;
    storyPoints: number; // Fibonacci: 1, 2, 3, 5, 8, 13
    dependencies: string[]; // Task IDs that must complete first
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    status: 'not_started' | 'in_progress' | 'blocked' | 'review' | 'done';
    acceptanceCriteria: string[];
    relatedFeature: string; // Feature ID
    sprint: number; // Which sprint this task belongs to
}

export interface Milestone {
    name: string;
    description: string;
    dueDate: string;
    deliverables: string[];
}

export interface TeamAllocation {
    roles: TeamMember[];
    workloadChart: WorkloadDistribution[];
}

export interface TeamMember {
    role: string; // "Tech Lead", "Backend Dev #1", "Security Engineer"
    skills: string[];
    assignedTasks: string[]; // Task IDs
    totalHours: number;
    utilizationPercentage: number; // 0-100 (>80% = overallocated)
}

export interface WorkloadDistribution {
    sprintNumber: number;
    roleWorkload: Record<string, number>; // role -> hours
}

export interface CriticalPathAnalysis {
    totalDuration: number; // days
    criticalTasks: string[]; // Task IDs on critical path (longest chain)
    bufferDays: number; // Slack time available
    parallelizableGroups: TaskGroup[]; // Groups of tasks that can run parallel
}

export interface TaskGroup {
    groupId: string;
    tasks: string[]; // Task IDs that can run in parallel
    estimatedDuration: number; // Max duration in the group
}

export interface RiskItem {
    id: string; // "RISK-001"
    category: 'technical' | 'resource' | 'schedule' | 'external' | 'security';
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number; // probability * impact (1-9)
    mitigation: string;
    contingencyPlan: string;
    owner: string; // Role responsible for monitoring
    status: 'identified' | 'mitigating' | 'resolved' | 'accepted';
}

/**
 * Main PM Tool Entry Point
 * Generate comprehensive project plan with sprint breakdown and risk analysis
 */
export function generateProjectPlan(input: PMInput): PMOutput {
    // STEP 1: Break down features into tasks
    const tasks = generateTaskBreakdown(input.features, input.threats);

    // STEP 2: Estimate effort and assign story points
    const estimatedTasks = estimateTaskEffort(tasks);

    // STEP 3: Analyze dependencies and critical path
    const criticalPath = analyzeCriticalPath(estimatedTasks);

    // STEP 4: Allocate tasks to sprints
    const sprints = allocateTasksToSprints(
        estimatedTasks,
        input.sprintDuration,
        input.projectStartDate,
        input.teamSize
    );

    // STEP 5: Allocate tasks to team members
    const teamAllocation = allocateTeamResources(estimatedTasks, sprints, input.teamSize);

    // STEP 6: Identify and analyze risks
    const riskRegister = generateRiskRegister(input.features, input.threats, criticalPath);

    // STEP 7: Generate Gantt chart visualization
    const ganttChart = generateGanttChart(sprints, estimatedTasks);

    return {
        sprints,
        taskBreakdown: estimatedTasks,
        teamAllocation,
        criticalPath,
        riskRegister,
        ganttChart
    };
}

/**
 * Break down features into granular tasks
 */
function generateTaskBreakdown(features: Feature[], threats: Threat[]): Task[] {
    const tasks: Task[] = [];
    let taskId = 1;

    for (const feature of features) {
        // STEP 1: Architecture/Design task for each feature
        tasks.push({
            id: `TASK-${String(taskId).padStart(3, '0')}`,
            title: `Design architecture for ${feature.name}`,
            description: `Create high-level design, data models, API contracts for ${feature.name}`,
            type: 'design',
            assignedRole: 'Tech Lead',
            estimatedHours: 8, // Will be refined in estimation step
            storyPoints: 3,
            dependencies: [],
            priority: feature.priority,
            status: 'not_started',
            acceptanceCriteria: [
                'Architecture diagram approved',
                'Data model documented',
                'API contracts defined'
            ],
            relatedFeature: feature.id,
            sprint: 0 // Will be assigned later
        });
        const designTaskId = `TASK-${String(taskId).padStart(3, '0')}`;
        taskId++;

        // STEP 2: Development tasks for sub-features
        for (const subFeature of feature.subFeatures) {
            // Backend implementation
            tasks.push({
                id: `TASK-${String(taskId).padStart(3, '0')}`,
                title: `Implement ${subFeature.name} - Backend`,
                description: `Develop backend logic, database operations, business rules for ${subFeature.name}`,
                type: 'development',
                assignedRole: 'Backend Dev',
                estimatedHours: 16,
                storyPoints: 5,
                dependencies: [designTaskId],
                priority: feature.priority,
                status: 'not_started',
                acceptanceCriteria: [
                    'Business logic implemented',
                    'Database queries optimized',
                    'Unit tests pass (>80% coverage)',
                    'Code review approved'
                ],
                relatedFeature: feature.id,
                sprint: 0
            });
            const backendTaskId = `TASK-${String(taskId).padStart(3, '0')}`;
            taskId++;

            // Unit testing
            tasks.push({
                id: `TASK-${String(taskId).padStart(3, '0')}`,
                title: `Unit tests for ${subFeature.name}`,
                description: `Write comprehensive unit tests with edge cases`,
                type: 'testing',
                assignedRole: 'QA Engineer',
                estimatedHours: 6,
                storyPoints: 3,
                dependencies: [backendTaskId],
                priority: feature.priority,
                status: 'not_started',
                acceptanceCriteria: [
                    'Code coverage >80%',
                    'Edge cases tested',
                    'Mocking/stubbing implemented'
                ],
                relatedFeature: feature.id,
                sprint: 0
            });
            taskId++;
        }

        // STEP 3: Security review task
        tasks.push({
            id: `TASK-${String(taskId).padStart(3, '0')}`,
            title: `Security review for ${feature.name}`,
            description: `Code review focusing on security vulnerabilities, OWASP Top 10 compliance`,
            type: 'security',
            assignedRole: 'Security Engineer',
            estimatedHours: 8,
            storyPoints: 3,
            dependencies: tasks.filter(t => t.relatedFeature === feature.id && t.type === 'development').map(t => t.id),
            priority: 'P0', // Security always P0
            status: 'not_started',
            acceptanceCriteria: [
                'No critical vulnerabilities',
                'Input validation verified',
                'Authentication/authorization checked',
                'Secrets management verified'
            ],
            relatedFeature: feature.id,
            sprint: 0
        });
        taskId++;

        // STEP 4: Integration testing
        tasks.push({
            id: `TASK-${String(taskId).padStart(3, '0')}`,
            title: `Integration tests for ${feature.name}`,
            description: `End-to-end testing with database, API, and external dependencies`,
            type: 'testing',
            assignedRole: 'QA Engineer',
            estimatedHours: 12,
            storyPoints: 5,
            dependencies: tasks.filter(t => t.relatedFeature === feature.id && t.type === 'development').map(t => t.id),
            priority: feature.priority,
            status: 'not_started',
            acceptanceCriteria: [
                'All user flows tested',
                'Database transactions verified',
                'API error handling tested',
                'Performance benchmarks met'
            ],
            relatedFeature: feature.id,
            sprint: 0
        });
        taskId++;
    }

    // STEP 5: Add threat-specific security tasks
    for (const threat of threats) {
        if (threat.impact === 'critical' || threat.riskScore >= 8.0) {
            tasks.push({
                id: `TASK-${String(taskId).padStart(3, '0')}`,
                title: `Mitigate threat: ${threat.name}`,
                description: `Implement security controls to address ${threat.category} threat`,
                type: 'security',
                assignedRole: 'Security Engineer',
                estimatedHours: 12,
                storyPoints: 5,
                dependencies: [],
                priority: 'P0',
                status: 'not_started',
                acceptanceCriteria: threat.mitigation.map(m => `✓ ${m}`),
                relatedFeature: threat.targetComponent,
                sprint: 0
            });
            taskId++;
        }
    }

    // STEP 6: Add DevOps/Infrastructure tasks
    tasks.push({
        id: `TASK-${String(taskId).padStart(3, '0')}`,
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions with SAST, DAST, dependency scanning',
        type: 'devops',
        assignedRole: 'DevOps Engineer',
        estimatedHours: 16,
        storyPoints: 8,
        dependencies: [],
        priority: 'P0',
        status: 'not_started',
        acceptanceCriteria: [
            'CI pipeline runs on every PR',
            'SAST scan integrated',
            'Deployment pipeline to staging',
            'Rollback mechanism tested'
        ],
        relatedFeature: 'Infrastructure',
        sprint: 1
    });
    taskId++;

    tasks.push({
        id: `TASK-${String(taskId).padStart(3, '0')}`,
        title: 'Setup monitoring & logging',
        description: 'Configure APM, log aggregation, alerting',
        type: 'devops',
        assignedRole: 'DevOps Engineer',
        estimatedHours: 12,
        storyPoints: 5,
        dependencies: [],
        priority: 'P1',
        status: 'not_started',
        acceptanceCriteria: [
            'APM dashboard configured',
            'Log aggregation working',
            'Alerts for critical errors',
            'Performance metrics tracked'
        ],
        relatedFeature: 'Infrastructure',
        sprint: 1
    });

    return tasks;
}

/**
 * Estimate effort for each task using historical data and complexity
 */
function estimateTaskEffort(tasks: Task[]): Task[] {
    // STEP 1: Adjust estimates based on task type and complexity
    //   - Design tasks: 4-16 hours
    //   - Development tasks: 8-40 hours
    //   - Testing tasks: 4-16 hours
    //   - Security tasks: 8-24 hours
    //   - DevOps tasks: 8-24 hours

    // STEP 2: Apply complexity multipliers
    //   - P0 (critical): 1.2x (more review cycles)
    //   - P1 (high): 1.0x
    //   - P2 (medium): 0.8x

    // STEP 3: Consider dependencies
    //   - Tasks with many dependencies: +20% (coordination overhead)

    // STEP 4: Map hours to story points (Fibonacci)
    //   - 1-4 hours: 1 point
    //   - 5-8 hours: 2 points
    //   - 9-12 hours: 3 points
    //   - 13-20 hours: 5 points
    //   - 21-40 hours: 8 points
    //   - >40 hours: 13 points (should be split)

    return tasks.map(task => {
        let adjustedHours = task.estimatedHours;

        // Priority multiplier
        if (task.priority === 'P0') adjustedHours *= 1.2;
        else if (task.priority === 'P2') adjustedHours *= 0.8;

        // Dependency overhead
        if (task.dependencies.length > 2) adjustedHours *= 1.2;

        // Story points mapping
        let storyPoints: number;
        if (adjustedHours <= 4) storyPoints = 1;
        else if (adjustedHours <= 8) storyPoints = 2;
        else if (adjustedHours <= 12) storyPoints = 3;
        else if (adjustedHours <= 20) storyPoints = 5;
        else if (adjustedHours <= 40) storyPoints = 8;
        else storyPoints = 13;

        return {
            ...task,
            estimatedHours: Math.round(adjustedHours),
            storyPoints
        };
    });
}

/**
 * Analyze critical path using topological sort + longest path algorithm
 */
function analyzeCriticalPath(tasks: Task[]): CriticalPathAnalysis {
    // STEP 1: Build dependency graph (adjacency list)
    //   - Node: Task
    //   - Edge: Task A -> Task B (B depends on A)

    // STEP 2: Topological sort to find valid execution order
    //   - Use Kahn's algorithm or DFS
    //   - Detect cycles (should not exist in valid plan)

    // STEP 3: Calculate Earliest Start Time (EST) for each task
    //   - EST(task) = MAX(EST(dependency) + duration(dependency))
    //   - Forward pass through graph

    // STEP 4: Calculate Latest Start Time (LST) for each task
    //   - LST(task) = MIN(LST(successor) - duration(task))
    //   - Backward pass through graph

    // STEP 5: Identify critical tasks
    //   - Critical task: EST == LST (no slack time)
    //   - Critical path: Chain of critical tasks from start to end

    // STEP 6: Find parallelizable groups
    //   - Tasks with no dependencies between them can run parallel
    //   - Group by same EST value

    // MOCK IMPLEMENTATION (replace with actual algorithm)
    const criticalTasks = tasks
        .filter(t => t.priority === 'P0')
        .map(t => t.id);

    const totalDuration = tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 40; // Convert to days (8h/day)

    return {
        totalDuration: Math.ceil(totalDuration),
        criticalTasks,
        bufferDays: Math.ceil(totalDuration * 0.2), // 20% buffer
        parallelizableGroups: [] // Would be calculated from graph analysis
    };
}

/**
 * Allocate tasks to sprints based on capacity and dependencies
 */
function allocateTasksToSprints(
    tasks: Task[],
    sprintDuration: number,
    startDate: string,
    teamSize: number
): SprintPlan[] {
    // STEP 1: Calculate team velocity
    //   - Team capacity = teamSize * sprintDuration * 5 days * 6 hours/day
    //   - Velocity = capacity / average_task_hours
    //   - Typical 3-5 person team: ~20-35 story points per 2-week sprint

    const sprintCapacity = teamSize * sprintDuration * 5 * 6; // hours
    const averagePointsPerHour = 0.3; // Rough estimate: 1 story point = ~3 hours
    const sprintVelocity = Math.floor(sprintCapacity * averagePointsPerHour);

    // STEP 2: Sort tasks by priority and dependencies
    //   - P0 tasks first
    //   - Tasks with no dependencies first
    //   - Tasks on critical path prioritized

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority.localeCompare(b.priority);
        }
        return a.dependencies.length - b.dependencies.length;
    });

    // STEP 3: Greedy allocation to sprints
    //   - Iterate through sorted tasks
    //   - Assign to earliest sprint where:
    //     (a) Dependencies are satisfied
    //     (b) Sprint has capacity
    //   - If task doesn't fit, move to next sprint

    const sprints: SprintPlan[] = [];
    let currentSprint = 1;
    let currentSprintPoints = 0;
    let currentSprintTasks: string[] = [];

    for (const task of sortedTasks) {
        // Check if dependencies are in previous sprints
        const dependenciesSatisfied = task.dependencies.every(depId => {
            const depTask = tasks.find(t => t.id === depId);
            return depTask && depTask.sprint < currentSprint;
        });

        if (!dependenciesSatisfied) {
            // Move to next sprint
            if (currentSprintTasks.length > 0) {
                sprints.push(createSprintPlan(currentSprint, currentSprintTasks, currentSprintPoints, startDate, sprintDuration));
                currentSprint++;
                currentSprintPoints = 0;
                currentSprintTasks = [];
            }
        }

        // Check capacity
        if (currentSprintPoints + task.storyPoints > sprintVelocity) {
            // Sprint full, move to next
            sprints.push(createSprintPlan(currentSprint, currentSprintTasks, currentSprintPoints, startDate, sprintDuration));
            currentSprint++;
            currentSprintPoints = 0;
            currentSprintTasks = [];
        }

        // Assign task to current sprint
        task.sprint = currentSprint;
        currentSprintTasks.push(task.id);
        currentSprintPoints += task.storyPoints;
    }

    // Add last sprint
    if (currentSprintTasks.length > 0) {
        sprints.push(createSprintPlan(currentSprint, currentSprintTasks, currentSprintPoints, startDate, sprintDuration));
    }

    return sprints;
}

/**
 * Create sprint plan with milestones
 */
function createSprintPlan(
    sprintNumber: number,
    taskIds: string[],
    storyPoints: number,
    projectStartDate: string,
    sprintDuration: number
): SprintPlan {
    const startDate = addDays(projectStartDate, (sprintNumber - 1) * sprintDuration * 7);
    const endDate = addDays(startDate, sprintDuration * 7 - 1);

    return {
        sprintNumber,
        startDate,
        endDate,
        goal: `Sprint ${sprintNumber} - Complete ${taskIds.length} tasks`,
        tasks: taskIds,
        storyPoints,
        milestones: [
            {
                name: `Sprint ${sprintNumber} Review`,
                description: `Demo completed features to stakeholders`,
                dueDate: endDate,
                deliverables: [`${taskIds.length} tasks completed`, 'Demo presentation']
            }
        ]
    };
}

/**
 * Allocate tasks to team members and calculate workload
 */
function allocateTeamResources(
    tasks: Task[],
    sprints: SprintPlan[],
    teamSize: number
): TeamAllocation {
    // STEP 1: Define team roles based on task types
    const roles = [
        { role: 'Tech Lead', skills: ['architecture', 'design', 'code_review'] },
        { role: 'Backend Dev #1', skills: ['backend', 'api', 'database'] },
        { role: 'Backend Dev #2', skills: ['backend', 'api', 'database'] },
        { role: 'Security Engineer', skills: ['security', 'threat_modeling', 'code_review'] },
        { role: 'QA Engineer', skills: ['testing', 'automation', 'security_testing'] }
    ].slice(0, teamSize); // Adjust to team size

    // STEP 2: Assign tasks to roles based on task.assignedRole
    const teamMembers: TeamMember[] = roles.map(r => ({
        role: r.role,
        skills: r.skills,
        assignedTasks: tasks.filter(t => matchRole(t.assignedRole, r.role)).map(t => t.id),
        totalHours: 0,
        utilizationPercentage: 0
    }));

    // STEP 3: Calculate total hours per team member
    for (const member of teamMembers) {
        member.totalHours = member.assignedTasks.reduce((sum, taskId) => {
            const task = tasks.find(t => t.id === taskId);
            return sum + (task?.estimatedHours || 0);
        }, 0);
    }

    // STEP 4: Calculate utilization percentage
    const totalAvailableHours = sprints.length * 2 * 5 * 6; // sprints * weeks * days * hours
    for (const member of teamMembers) {
        member.utilizationPercentage = Math.round((member.totalHours / totalAvailableHours) * 100);
    }

    // STEP 5: Generate workload distribution per sprint
    const workloadChart: WorkloadDistribution[] = sprints.map(sprint => {
        const roleWorkload: Record<string, number> = {};
        for (const member of teamMembers) {
            const sprintTasks = member.assignedTasks.filter(taskId => 
                tasks.find(t => t.id === taskId)?.sprint === sprint.sprintNumber
            );
            roleWorkload[member.role] = sprintTasks.reduce((sum, taskId) => {
                const task = tasks.find(t => t.id === taskId);
                return sum + (task?.estimatedHours || 0);
            }, 0);
        }
        return {
            sprintNumber: sprint.sprintNumber,
            roleWorkload
        };
    });

    return {
        roles: teamMembers,
        workloadChart
    };
}

/**
 * Generate comprehensive risk register
 */
function generateRiskRegister(
    features: Feature[],
    threats: Threat[],
    criticalPath: CriticalPathAnalysis
): RiskItem[] {
    const risks: RiskItem[] = [];
    let riskId = 1;

    // STEP 1: Technical risks from features
    for (const feature of features) {
        if (feature.priority === 'P0') {
            risks.push({
                id: `RISK-${String(riskId++).padStart(3, '0')}`,
                category: 'technical',
                description: `Feature "${feature.name}" may have technical complexity issues`,
                probability: 'medium',
                impact: 'high',
                riskScore: 6,
                mitigation: 'Conduct POC before full implementation, allocate extra buffer time',
                contingencyPlan: 'Reduce feature scope to MVP if timeline at risk',
                owner: 'Tech Lead',
                status: 'identified'
            });
        }
    }

    // STEP 2: Security risks from threats
    for (const threat of threats) {
        if (threat.impact === 'critical') {
            risks.push({
                id: `RISK-${String(riskId++).padStart(3, '0')}`,
                category: 'security',
                description: `Critical threat: ${threat.name} - ${threat.description}`,
                probability: threat.likelihood,
                impact: threat.impact,
                riskScore: threat.riskScore,
                mitigation: threat.mitigation.join('; '),
                contingencyPlan: 'Implement compensating controls, escalate to CISO',
                owner: 'Security Engineer',
                status: 'identified'
            });
        }
    }

    // STEP 3: Resource risks
    risks.push({
        id: `RISK-${String(riskId++).padStart(3, '0')}`,
        category: 'resource',
        description: 'Key team member leaving during project',
        probability: 'low',
        impact: 'high',
        riskScore: 4,
        mitigation: 'Knowledge sharing sessions, documentation, pair programming',
        contingencyPlan: 'Cross-train team members, maintain up-to-date documentation',
        owner: 'Tech Lead',
        status: 'mitigating'
    });

    // STEP 4: Schedule risks from critical path
    if (criticalPath.bufferDays < 5) {
        risks.push({
            id: `RISK-${String(riskId++).padStart(3, '0')}`,
            category: 'schedule',
            description: 'Critical path has minimal buffer, high risk of delay',
            probability: 'high',
            impact: 'high',
            riskScore: 9,
            mitigation: 'Add buffer tasks, parallelize work where possible, reduce scope if needed',
            contingencyPlan: 'Negotiate deadline extension, prioritize P0 features only',
            owner: 'Tech Lead',
            status: 'mitigating'
        });
    }

    // STEP 5: External risks
    risks.push({
        id: `RISK-${String(riskId++).padStart(3, '0')}`,
        category: 'external',
        description: 'Third-party API/service dependency failure',
        probability: 'medium',
        impact: 'medium',
        riskScore: 5,
        mitigation: 'Implement fallback mechanisms, cache responses, SLA monitoring',
        contingencyPlan: 'Switch to alternative provider, implement offline mode',
        owner: 'Backend Dev',
        status: 'mitigating'
    });

    return risks;
}

/**
 * Generate Gantt chart in Mermaid format
 */
function generateGanttChart(sprints: SprintPlan[], tasks: Task[]): string {
    const lines: string[] = [];

    lines.push('```mermaid');
    lines.push('gantt');
    lines.push('    title Project Timeline');
    lines.push('    dateFormat YYYY-MM-DD');
    lines.push('    section Sprints');

    for (const sprint of sprints) {
        lines.push(`    Sprint ${sprint.sprintNumber}    :sprint${sprint.sprintNumber}, ${sprint.startDate}, ${sprint.endDate}`);
    }

    lines.push('    section Critical Tasks');
    
    // Show only critical path tasks to avoid clutter
    const criticalTasks = tasks.filter(t => t.priority === 'P0').slice(0, 10);
    for (const task of criticalTasks) {
        const sprint = sprints.find(s => s.sprintNumber === task.sprint);
        if (sprint) {
            lines.push(`    ${task.title.slice(0, 30)}    :task${task.id}, ${sprint.startDate}, ${Math.ceil(task.estimatedHours / 8)}d`);
        }
    }

    lines.push('```');

    return lines.join('\n');
}

// ==================== HELPER FUNCTIONS ====================

function matchRole(assignedRole: string, memberRole: string): boolean {
    const normalized = assignedRole.toLowerCase();
    if (normalized.includes('backend') && memberRole.includes('Backend')) return true;
    if (normalized.includes('tech lead') && memberRole.includes('Tech Lead')) return true;
    if (normalized.includes('security') && memberRole.includes('Security')) return true;
    if (normalized.includes('qa') && memberRole.includes('QA')) return true;
    if (normalized.includes('devops') && memberRole.includes('DevOps')) return true;
    return false;
}

function addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}