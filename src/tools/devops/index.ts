// DevOps Tool - CI/CD Pipeline Design (Expert Mode: CMake, Ninja, Tauri)
export interface DevOpsInput {
    projectName: string;
    techStack: string[];
    deploymentTarget: 'kubernetes' | 'aws' | 'azure' | 'gcp' | 'docker';
    repositoryPlatform: 'github' | 'gitlab' | 'bitbucket';
}

export interface DevOpsOutput {
    pipelineStages: PipelineStage[];
    securityGates: SecurityGate[];
    deploymentConfig: DeploymentConfig;
    buildConfig?: string; // New field for CMake/Ninja/Cargo
}

export interface PipelineStage {
    name: string;
    order: number;
    jobs: Job[];
}

export interface Job {
    name: string;
    commands: string[];
}

export interface SecurityGate {
    name: string;
    tool: string;
    failCondition: string;
}

export interface DeploymentConfig {
    strategy: string;
    rollbackEnabled: boolean;
    healthCheck: string;
}

/**
 * Design CI/CD pipeline with security gates
 */
export function designCICD(input: DevOpsInput): DevOpsOutput {
    const { projectName, techStack, deploymentTarget, repositoryPlatform } = input;

    const pipelineStages = generatePipelineStages(techStack);
    const securityGates = generateSecurityGates(techStack);
    const deploymentConfig = generateDeploymentConfig(deploymentTarget);
    const buildConfig = generateBuildConfig(techStack);

    return {
        pipelineStages,
        securityGates,
        deploymentConfig,
        buildConfig
    };
}

function generatePipelineStages(techStack: string[]): PipelineStage[] {
    const stack = techStack.map(s => s.toLowerCase());
    const isCpp = stack.some(s => s === 'c++' || s === 'cpp');
    const isRust = stack.some(s => s === 'rust');
    const isTauri = stack.some(s => s === 'tauri');

    const jobs: Job[] = [
        { name: 'Checkout', commands: ['git checkout $BRANCH'] }
    ];

    if (isCpp) {
        jobs.push({ name: 'Configure CMake', commands: ['cmake -S . -B build -G Ninja'] });
        jobs.push({ name: 'Build', commands: ['cmake --build build'] });
        jobs.push({ name: 'Test', commands: ['cd build && ctest'] });
    } else if (isRust || isTauri) {
        jobs.push({ name: 'Build', commands: ['cargo build --release'] });
        jobs.push({ name: 'Test', commands: ['cargo test'] });
        if (isTauri) jobs.push({ name: 'Tauri Build', commands: ['npm run tauri build'] });
    } else {
        jobs.push({ name: 'Install', commands: detectInstallCommand(techStack) });
        jobs.push({ name: 'Build', commands: detectBuildCommand(techStack) });
    }

    const stages: PipelineStage[] = [
        {
            name: 'Build & Test',
            order: 1,
            jobs: jobs
        },
        {
            name: 'Security Scan',
            order: 2,
            jobs: [
                { name: 'SAST', commands: detectSASTCommand(techStack) },
                { name: 'Dependency Check', commands: ['npm audit', 'cargo audit', 'conan info .'] }
            ]
        }
    ];

    return stages;
}

function generateSecurityGates(techStack: string[]): SecurityGate[] {
    const stack = techStack.map(s => s.toLowerCase());
    const gates = [
        {
            name: 'Secret Scan',
            tool: 'TruffleHog',
            failCondition: 'Any secrets detected'
        }
    ];

    if (stack.includes('c++')) {
        gates.push({ name: 'Memory Safe', tool: 'Valgrind/ASan', failCondition: 'Memory leaks detected' });
    }
    if (stack.includes('rust')) {
        gates.push({ name: 'Audit', tool: 'cargo-audit', failCondition: 'Vulnerable crates' });
    }

    return gates;
}

function generateDeploymentConfig(target: string): DeploymentConfig {
    return {
        strategy: 'Blue-Green',
        rollbackEnabled: true,
        healthCheck: '/health'
    };
}

function generateBuildConfig(techStack: string[]): string {
    const stack = techStack.map(s => s.toLowerCase());
    if (stack.includes('c++')) {
        return `# CMakeLists.txt\ncmake_minimum_required(VERSION 3.20)\nproject(MyApp)\nadd_executable(MyApp main.cpp)\n`;
    }
    if (stack.includes('rust')) {
        return `# Cargo.toml\n[package]\nname = "my_app"\nversion = "0.1.0"\n[dependencies]\n`;
    }
    return '';
}

function detectInstallCommand(techStack: string[]): string[] {
    // Simplified
    return ['npm ci'];
}

function detectBuildCommand(techStack: string[]): string[] {
    // Simplified
    return ['npm run build'];
}

function detectSASTCommand(techStack: string[]): string[] {
    const stack = techStack.map(s => s.toLowerCase());
    if (stack.includes('c++')) return ['cppcheck .', 'flawfinder .'];
    if (stack.includes('rust')) return ['cargo clippy'];
    return ['semgrep scan'];
}
