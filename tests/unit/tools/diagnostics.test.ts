import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    generateWorkspaceSnapshot,
    runDiagnostics,
    parseErrorLog,
    runPlaybook
} from '../../../src/tools/diagnostics/index.js';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Diagnostics Tool', () => {
    const testDir = join(tmpdir(), 'ssdlc-test-' + Date.now());

    beforeEach(() => {
        // Create test directory
        if (!existsSync(testDir)) {
            mkdirSync(testDir, { recursive: true });
        }
        // Create test files
        writeFileSync(join(testDir, 'package.json'), '{}');
        writeFileSync(join(testDir, 'index.ts'), 'console.log("test")');
        mkdirSync(join(testDir, 'src'), { recursive: true });
        writeFileSync(join(testDir, 'src', 'main.ts'), 'export const x = 1;');
    });

    afterEach(() => {
        // Cleanup
        try {
            rmSync(testDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
    });

    describe('generateWorkspaceSnapshot', () => {
        it('should generate snapshot of workspace', () => {
            const snapshot = generateWorkspaceSnapshot(testDir, 3);

            expect(snapshot).toBeDefined();
            expect(snapshot.root).toBe(testDir);
            expect(snapshot.os).toBeDefined();
            expect(['windows', 'linux', 'darwin']).toContain(snapshot.os);
            expect(snapshot.files).toBeInstanceOf(Array);
        });

        it('should include files in snapshot', () => {
            const snapshot = generateWorkspaceSnapshot(testDir, 3);

            const filePaths = snapshot.files.map(f => f.path);
            expect(filePaths).toContain('package.json');
            expect(filePaths).toContain('index.ts');
        });

        it('should include directories in snapshot', () => {
            const snapshot = generateWorkspaceSnapshot(testDir, 3);

            const dirs = snapshot.files.filter(f => f.type === 'directory');
            expect(dirs.length).toBeGreaterThan(0);
        });

        it('should count files and directories', () => {
            const snapshot = generateWorkspaceSnapshot(testDir, 3);

            expect(snapshot.totalFiles).toBeGreaterThan(0);
            expect(snapshot.totalDirs).toBeGreaterThanOrEqual(0);
        });

        it('should respect max depth', () => {
            const shallowSnapshot = generateWorkspaceSnapshot(testDir, 0);
            const deepSnapshot = generateWorkspaceSnapshot(testDir, 5);

            // Shallow should have fewer or equal files
            expect(shallowSnapshot.files.length).toBeLessThanOrEqual(deepSnapshot.files.length);
        });
    });

    describe('runDiagnostics', () => {
        it('should return array of diagnostic results', () => {
            const results = runDiagnostics(testDir);

            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
        });

        it('should check Node.js installation', () => {
            const results = runDiagnostics(testDir);

            const nodeCheck = results.find(r => r.name === 'Node.js');
            expect(nodeCheck).toBeDefined();
            expect(['ok', 'warning', 'error']).toContain(nodeCheck!.status);
        });

        it('should check package.json existence', () => {
            const results = runDiagnostics(testDir);

            const pkgCheck = results.find(r => r.name === 'package.json');
            expect(pkgCheck).toBeDefined();
            expect(pkgCheck!.status).toBe('ok');
        });

        it('should have message for each result', () => {
            const results = runDiagnostics(testDir);

            results.forEach(result => {
                expect(result.message).toBeDefined();
                expect(result.message.length).toBeGreaterThan(0);
            });
        });
    });

    describe('parseErrorLog', () => {
        it('should extract errors from log', () => {
            const log = `
                Building project...
                error: Cannot find module 'express'
                at line 10
                Error: Connection refused
            `;

            const result = parseErrorLog(log);

            expect(result.errors).toBeInstanceOf(Array);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should provide suggestions for common errors', () => {
            const log = `Cannot find module 'express'`;

            const result = parseErrorLog(log);

            expect(result.suggestions).toBeInstanceOf(Array);
            expect(result.suggestions.some(s => s.includes('pnpm install'))).toBe(true);
        });

        it('should detect file not found errors', () => {
            const log = `ENOENT: no such file or directory, open 'config.json'`;

            const result = parseErrorLog(log);

            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.suggestions.some(s => s.toLowerCase().includes('file'))).toBe(true);
        });

        it('should detect permission errors', () => {
            const log = `Error: EACCES: permission denied, access '/etc/hosts'`;

            const result = parseErrorLog(log);

            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.suggestions.some(s => s.toLowerCase().includes('permission'))).toBe(true);
        });

        it('should handle empty log', () => {
            const result = parseErrorLog('');

            expect(result.errors).toEqual([]);
            expect(result.suggestions).toEqual([]);
        });

        it('should deduplicate errors', () => {
            const log = `
                error: duplicate error
                error: duplicate error
                error: duplicate error
            `;

            const result = parseErrorLog(log);

            // Should only have one unique error
            expect(result.errors.length).toBe(1);
        });
    });

    describe('runPlaybook', () => {
        it('should run check_node playbook', () => {
            const result = runPlaybook('check_node', testDir);

            expect(result).toBeDefined();
            expect(result.playbook).toBe('check_node');
            expect(result.commands).toBeInstanceOf(Array);
        });

        it('should return error for unknown playbook', () => {
            const result = runPlaybook('unknown_playbook', testDir);

            expect(result.success).toBe(false);
            expect(result.summary).toContain('Unknown playbook');
        });

        it('should include command results', () => {
            const result = runPlaybook('check_node', testDir);

            result.commands.forEach(cmd => {
                expect(cmd.command).toBeDefined();
                expect(typeof cmd.exitCode).toBe('number');
                expect(typeof cmd.duration).toBe('number');
            });
        });
    });
});
