import type { Exportable, ExportFormat, ExportOptions } from '../types/export.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { stringify as yamlStringify } from 'yaml';

/**
 * Export data to JSON format
 */
export function toJSON(data: unknown): string {
    return JSON.stringify(data, null, 2);
}

/**
 * Export data to YAML format
 */
export function toYAML(data: unknown): string {
    return yamlStringify(data, { indent: 2 });
}

/**
 * Convert object to Markdown format
 */
export function toMarkdown(data: unknown, title?: string): string {
    const lines: string[] = [];

    if (title) {
        lines.push(`# ${title}`, '');
    }

    function renderValue(value: unknown, depth: number = 0): string[] {
        const indent = '  '.repeat(depth);
        const result: string[] = [];

        if (Array.isArray(value)) {
            for (const item of value) {
                if (typeof item === 'object' && item !== null) {
                    result.push(...renderValue(item, depth));
                    result.push('');
                } else {
                    result.push(`${indent}- ${item}`);
                }
            }
        } else if (typeof value === 'object' && value !== null) {
            for (const [key, val] of Object.entries(value)) {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

                if (typeof val === 'object' && val !== null) {
                    result.push(`${indent}### ${formattedKey}`, '');
                    result.push(...renderValue(val, depth + 1));
                } else {
                    result.push(`${indent}- **${formattedKey}**: ${val}`);
                }
            }
        } else {
            result.push(`${indent}${value}`);
        }

        return result;
    }

    lines.push(...renderValue(data));
    return lines.join('\n');
}

/**
 * Export to all formats at once
 */
export function exportAll(
    data: unknown,
    basePath: string,
    filename: string,
    title?: string
): { json: string; yaml: string; markdown: string } {
    // Ensure directory exists
    mkdirSync(basePath, { recursive: true });

    const json = toJSON(data);
    const yaml = toYAML(data);
    const markdown = toMarkdown(data, title);

    // Write files
    writeFileSync(join(basePath, `${filename}.json`), json);
    writeFileSync(join(basePath, `${filename}.yaml`), yaml);
    writeFileSync(join(basePath, `${filename}.md`), markdown);

    return { json, yaml, markdown };
}

/**
 * Export based on options
 */
export function exportData(
    data: unknown,
    options: ExportOptions
): string | { json: string; yaml: string; markdown: string } {
    switch (options.format) {
        case 'json':
            return toJSON(data);
        case 'yaml':
            return toYAML(data);
        case 'markdown':
            return toMarkdown(data);
        case 'all':
            if (!options.outputPath) {
                return {
                    json: toJSON(data),
                    yaml: toYAML(data),
                    markdown: toMarkdown(data)
                };
            }
            return exportAll(data, options.outputPath, 'output');
        default:
            return toJSON(data);
    }
}
