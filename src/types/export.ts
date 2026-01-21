// Export format interface
export interface Exportable {
    toJSON(): string;
    toYAML(): string;
    toMarkdown(): string;
}

// Export options
export interface ExportOptions {
    format: 'json' | 'yaml' | 'markdown' | 'all';
    outputPath?: string;
    includeTimestamp?: boolean;
}

export type ExportFormat = 'json' | 'yaml' | 'markdown';
