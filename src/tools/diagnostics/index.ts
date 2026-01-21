// Dev Diagnostics Tool - Path, Environment, and Config Debugging
// MCP tool for diagnosing development environment issues

import { readdirSync, existsSync, readFileSync, statSync, appendFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, relative, extname, basename } from 'path';
import { execSync } from 'child_process';
import { platform } from 'os';

export interface WorkspaceSnapshot {
    root: string;
    os: 'windows' | 'linux' | 'darwin';
    timestamp: string;
    ignored: string[];
    files: FileEntry[];
    totalFiles: number;
    totalDirs: number;
}

export interface FileEntry {
    path: string;
    type: 'file' | 'directory';
    size?: number;
    modified?: string;
    extension?: string;
}

export interface DiagnosticResult {
    name: string;
    status: 'ok' | 'warning' | 'error';
    message: string;
    details?: string;
    suggestion?: string;
}

export interface PlaybookResult {
    playbook: string;
    commands: CommandResult[];
    success: boolean;
    summary: string;
}

export interface CommandResult {
    command: string;
    exitCode: number;
    stdout: string;
    stderr: string;
    duration: number;
}

export interface LastKnownGood {
    timestamp: string;
    config: Record<string, string>;
    commands: string[];
}

const DIAGNOSTIC_LOG_DIR = '.ssdlc-diagnostics';
const SUCCESS_LOG = 'success-config.json';
const COMMAND_HISTORY = 'command-history.log';

interface IgnorePatterns {
    ignores: (path: string) => boolean;
    patterns: string[];
}

/**
 * Generate workspace snapshot
 */
export function generateWorkspaceSnapshot(
    rootPath: string,
    maxDepth: number = 5
): WorkspaceSnapshot {
    const osName = platform();
    const osType: 'windows' | 'linux' | 'darwin' = osName === 'win32' ? 'windows' : (osName === 'darwin' ? 'darwin' : 'linux');
    const ignorePatterns = loadGitignore(rootPath);

    const files: FileEntry[] = [];
    let totalFiles = 0;
    let totalDirs = 0;

    function walk(dir: string, depth: number) {
        if (depth > maxDepth) return;

        try {
            const entries = readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                const relativePath = relative(rootPath, fullPath);

                // Skip ignored files
                if (ignorePatterns.ignores(relativePath)) continue;
                if (entry.name.startsWith('.') && entry.name !== '.gitignore') continue;

                if (entry.isDirectory()) {
                    totalDirs++;
                    files.push({
                        path: relativePath,
                        type: 'directory'
                    });
                    walk(fullPath, depth + 1);
                } else {
                    totalFiles++;
                    const stat = statSync(fullPath);
                    files.push({
                        path: relativePath,
                        type: 'file',
                        size: stat.size,
                        modified: stat.mtime.toISOString(),
                        extension: extname(entry.name).slice(1) || undefined
                    });
                }
            }
        } catch {
            // Permission denied or other error
        }
    }

    walk(rootPath, 0);

    return {
        root: rootPath,
        os: osType,
        timestamp: new Date().toISOString(),
        ignored: ignorePatterns.patterns || [],
        files,
        totalFiles,
        totalDirs
    };
}

/**
 * Run diagnostic playbook
 */
export function runPlaybook(
    playbookName: string,
    workspaceRoot: string
): PlaybookResult {
    const playbook = PLAYBOOKS[playbookName];
    if (!playbook) {
        return {
            playbook: playbookName,
            commands: [],
            success: false,
            summary: `Unknown playbook: ${playbookName}`
        };
    }

    const osKey = getOsKey();
    const commands = playbook[osKey] || [];
    const results: CommandResult[] = [];
    let allSuccess = true;

    for (const cmd of commands) {
        const result = runCommand(cmd, workspaceRoot);
        results.push(result);

        if (result.exitCode !== 0) {
            allSuccess = false;
        }

        // Log successful commands
        if (result.exitCode === 0) {
            logSuccessCommand(workspaceRoot, cmd, result);
        }
    }

    return {
        playbook: playbookName,
        commands: results,
        success: allSuccess,
        summary: allSuccess
            ? `✅ Playbook ${playbookName} completed successfully`
            : `❌ Playbook ${playbookName} failed`
    };
}

/**
 * Run environment diagnostics
 */
export function runDiagnostics(workspaceRoot: string): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];
    const osKey = getOsKey();

    // Check Node.js
    results.push(checkCommand('node --version', 'Node.js', 'Install Node.js v18+'));

    // Check pnpm/npm
    results.push(checkCommand('pnpm --version', 'pnpm', 'npm install -g pnpm'));

    // Check Git
    results.push(checkCommand('git --version', 'Git', 'Install Git'));

    // Check TypeScript
    results.push(checkCommand('pnpm tsc --version', 'TypeScript', 'pnpm add -D typescript'));

    // OS-specific checks
    if (osKey === 'windows') {
        // Check MSVC
        results.push(checkMsvc());

        // Check CMake
        results.push(checkCommand('cmake --version', 'CMake', 'Install CMake'));
    }

    // Check workspace files
    results.push(checkFile(workspaceRoot, 'package.json', 'Missing package.json'));
    results.push(checkFile(workspaceRoot, 'tsconfig.json', 'Missing tsconfig.json'));

    return results;
}

/**
 * Parse error log to find issues
 */
export function parseErrorLog(
    logContent: string,
    logType: 'build' | 'test' | 'generic' = 'generic'
): { errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    const lines = logContent.split('\n');

    for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Common error patterns
        if (lowerLine.includes('error:') || lowerLine.includes('error ts')) {
            errors.push(line.trim());
        }

        if (lowerLine.includes('cannot find module')) {
            errors.push(line.trim());
            suggestions.push('Run: pnpm install');
        }

        if (lowerLine.includes('enoent') || lowerLine.includes('no such file')) {
            errors.push(line.trim());
            suggestions.push('Check file paths - file may be missing or moved');
        }

        if (lowerLine.includes('permission denied')) {
            errors.push(line.trim());
            suggestions.push('Check file permissions or run as administrator');
        }

        if (lowerLine.includes('vcvarsall.bat')) {
            errors.push(line.trim());
            suggestions.push('Run Visual Studio Installer to fix MSVC');
        }

        if (lowerLine.includes('cmake') && lowerLine.includes('not found')) {
            errors.push(line.trim());
            suggestions.push('Install CMake: https://cmake.org/download/');
        }
    }

    return {
        errors: [...new Set(errors)].slice(0, 20),
        suggestions: [...new Set(suggestions)]
    };
}

/**
 * Get last known good configuration
 */
export function getLastKnownGood(workspaceRoot: string): LastKnownGood | null {
    const logDir = join(workspaceRoot, DIAGNOSTIC_LOG_DIR);
    const successFile = join(logDir, SUCCESS_LOG);

    if (!existsSync(successFile)) {
        return null;
    }

    try {
        return JSON.parse(readFileSync(successFile, 'utf-8'));
    } catch {
        return null;
    }
}

/**
 * Save successful configuration
 */
export function saveLastKnownGood(
    workspaceRoot: string,
    config: Record<string, string>,
    commands: string[]
): void {
    const logDir = join(workspaceRoot, DIAGNOSTIC_LOG_DIR);
    const successFile = join(logDir, SUCCESS_LOG);

    if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
    }

    const data: LastKnownGood = {
        timestamp: new Date().toISOString(),
        config,
        commands
    };

    appendFileSync(successFile, JSON.stringify(data, null, 2));
}

// ==================== PLAYBOOKS ====================

const PLAYBOOKS: Record<string, Record<string, string[]>> = {
    'check_node': {
        windows: [
            'node --version',
            'npm --version',
            'pnpm --version'
        ],
        linux: [
            'node --version',
            'npm --version',
            'pnpm --version'
        ],
        darwin: [
            'node --version',
            'npm --version',
            'pnpm --version'
        ]
    },
    'check_msvc': {
        windows: [
            'where cl',
            'cmd /c "echo %VSINSTALLDIR%"'
        ],
        linux: [],
        darwin: []
    },
    'check_cmake': {
        windows: [
            'cmake --version',
            'where cmake'
        ],
        linux: [
            'cmake --version',
            'which cmake'
        ],
        darwin: [
            'cmake --version',
            'which cmake'
        ]
    },
    'check_git': {
        windows: [
            'git --version',
            'git config --global user.name',
            'git config --global user.email'
        ],
        linux: [
            'git --version',
            'git config --global user.name',
            'git config --global user.email'
        ],
        darwin: [
            'git --version',
            'git config --global user.name',
            'git config --global user.email'
        ]
    },
    'check_env': {
        windows: [
            'echo %PATH%',
            'echo %NODE_ENV%',
            'echo %USERPROFILE%'
        ],
        linux: [
            'echo $PATH',
            'echo $NODE_ENV',
            'echo $HOME'
        ],
        darwin: [
            'echo $PATH',
            'echo $NODE_ENV',
            'echo $HOME'
        ]
    },
    'fix_node_modules': {
        windows: [
            'rmdir /s /q node_modules 2>nul',
            'del pnpm-lock.yaml 2>nul',
            'pnpm install'
        ],
        linux: [
            'rm -rf node_modules',
            'rm -f pnpm-lock.yaml',
            'pnpm install'
        ],
        darwin: [
            'rm -rf node_modules',
            'rm -f pnpm-lock.yaml',
            'pnpm install'
        ]
    },
    'clean_build': {
        windows: [
            'rmdir /s /q dist 2>nul',
            'rmdir /s /q build 2>nul',
            'pnpm build'
        ],
        linux: [
            'rm -rf dist build',
            'pnpm build'
        ],
        darwin: [
            'rm -rf dist build',
            'pnpm build'
        ]
    }
};

// ==================== HELPERS ====================

function loadGitignore(rootPath: string): IgnorePatterns {
    const gitignorePath = join(rootPath, '.gitignore');
    const defaultPatterns = ['node_modules', '.git', 'dist', 'build'];

    if (!existsSync(gitignorePath)) {
        return {
            ignores: (path: string) => defaultPatterns.some(p => path.includes(p)),
            patterns: defaultPatterns
        };
    }

    try {
        const content = readFileSync(gitignorePath, 'utf-8');
        const patterns = content.split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('#'));
        const allPatterns = [...patterns, ...defaultPatterns];

        return {
            ignores: (path: string) => allPatterns.some(p => {
                if (p.includes('*')) {
                    // Simple glob matching
                    const regex = new RegExp('^' + p.replace(/\*/g, '.*') + '$');
                    return regex.test(path) || regex.test(path.split('/').pop() || '');
                }
                return path.includes(p);
            }),
            patterns: allPatterns
        };
    } catch {
        return {
            ignores: (path: string) => defaultPatterns.some(p => path.includes(p)),
            patterns: defaultPatterns
        };
    }
}

function getOsKey(): 'windows' | 'linux' | 'darwin' {
    const os = platform();
    if (os === 'win32') return 'windows';
    if (os === 'darwin') return 'darwin';
    return 'linux';
}

function runCommand(cmd: string, cwd: string): CommandResult {
    const start = Date.now();

    try {
        const stdout = execSync(cmd, {
            cwd,
            encoding: 'utf-8',
            timeout: 30000,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        return {
            command: cmd,
            exitCode: 0,
            stdout: stdout.trim(),
            stderr: '',
            duration: Date.now() - start
        };
    } catch (error: any) {
        return {
            command: cmd,
            exitCode: error.status || 1,
            stdout: error.stdout?.trim() || '',
            stderr: error.stderr?.trim() || error.message,
            duration: Date.now() - start
        };
    }
}

function checkCommand(cmd: string, name: string, suggestion: string): DiagnosticResult {
    const result = runCommand(cmd, process.cwd());

    if (result.exitCode === 0) {
        return {
            name,
            status: 'ok',
            message: `✅ ${name}: ${result.stdout.split('\n')[0]}`,
            details: result.stdout
        };
    }

    return {
        name,
        status: 'error',
        message: `❌ ${name} not found or not working`,
        details: result.stderr,
        suggestion
    };
}

function checkFile(rootPath: string, fileName: string, errorMsg: string): DiagnosticResult {
    const filePath = join(rootPath, fileName);

    if (existsSync(filePath)) {
        return {
            name: fileName,
            status: 'ok',
            message: `✅ ${fileName} exists`
        };
    }

    return {
        name: fileName,
        status: 'error',
        message: `❌ ${errorMsg}`,
        suggestion: `Create ${fileName} in project root`
    };
}

function checkMsvc(): DiagnosticResult {
    const result = runCommand(
        'cmd /c "where cl"',
        process.cwd()
    );

    if (result.exitCode === 0) {
        return {
            name: 'MSVC',
            status: 'ok',
            message: '✅ MSVC compiler found',
            details: result.stdout
        };
    }

    return {
        name: 'MSVC',
        status: 'warning',
        message: '⚠️ MSVC not in PATH',
        suggestion: 'Run vcvarsall.bat or install Visual Studio Build Tools'
    };
}

function logSuccessCommand(workspaceRoot: string, cmd: string, result: CommandResult): void {
    const logDir = join(workspaceRoot, DIAGNOSTIC_LOG_DIR);
    const historyFile = join(logDir, COMMAND_HISTORY);

    if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
    }

    const logEntry = `[${new Date().toISOString()}] ✅ ${cmd}\n`;
    appendFileSync(historyFile, logEntry);
}
