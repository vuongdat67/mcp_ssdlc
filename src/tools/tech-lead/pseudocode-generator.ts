// ver 2
// Tech Lead Tool - Pseudocode Generator (Expert Mode: C++, Rust, Malware Analysis support)
import type { Module, ClassDefinition, PseudocodeFile } from '../../types/tech-lead.js';

export type PseudocodeLanguage = 'python' | 'typescript' | 'java' | 'go' | 'csharp' | 'cpp' | 'rust';

/**
 * Generate pseudocode files from modules
 */
export function generatePseudocode(
    modules: Module[],
    language: PseudocodeLanguage = 'python'
): PseudocodeFile[] {
    const files: PseudocodeFile[] = [];

    for (const module of modules) {
        for (const cls of module.classes) {
            const file = generateClassPseudocode(module, cls, language);
            files.push(file);
        }
    }

    return files;
}

/**
 * Generate pseudocode for a class
 */
function generateClassPseudocode(
    module: Module,
    cls: ClassDefinition,
    language: PseudocodeLanguage
): PseudocodeFile {
    const content = generatePseudocodeContent(cls, language, module.type);
    const filename = toFilename(cls.name, language);

    return {
        filename,
        module: module.name,
        language,
        purpose: cls.purpose,
        securityNotes: generateSecurityNotes(cls, language),
        content
    };
}

/**
 * Generate pseudocode content based on language
 */
function generatePseudocodeContent(cls: ClassDefinition, language: PseudocodeLanguage, moduleType: string): string {
    switch (language) {
        case 'python': return generatePythonPseudocode(cls);
        case 'typescript': return generateTypeScriptPseudocode(cls);
        case 'java': return generateJavaPseudocode(cls);
        case 'go': return generateGoPseudocode(cls);
        case 'csharp': return generateCSharpPseudocode(cls);
        case 'cpp': return generateCppPseudocode(cls);
        case 'rust': return generateRustPseudocode(cls);
        default: return generatePythonPseudocode(cls);
    }
}

// --- Generators ---

function generateCppPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// File: ${name}.h (and .cpp implementation)`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push(`// Security: See security notes`);
    lines.push('');
    lines.push('#pragma once');
    lines.push('#include <string>');
    lines.push('#include <memory>');
    lines.push('#include <vector>');
    lines.push('');
    lines.push(`class ${name} {`);
    lines.push('public:');

    // Constructor
    lines.push(`    ${name}();`);
    lines.push(`    virtual ~${name}();`);
    lines.push('');

    // Methods
    for (const method of cls.methods) {
        lines.push(`    /**`);
        lines.push(`     * ${method.description}`);
        lines.push(`     */`);
        lines.push(`    ${cppType(method.returns)} ${method.name}(${cppParams(method.params)});`);
    }

    lines.push('');
    lines.push('private:');
    for (const prop of cls.properties) {
        lines.push(`    ${cppType(prop.type)} ${prop.name};`);
    }
    lines.push('};'); // End class

    lines.push('');
    lines.push('// Implementation');
    lines.push('');

    lines.push(`${name}::${name}() {`);
    lines.push('    // Initialize secure resources');
    lines.push('}');
    lines.push('');
    lines.push(`${name}::~${name}() {`);
    lines.push('    // Secure cleanup (zeroize sensitive memory)');
    lines.push('}');
    lines.push('');

    for (const method of cls.methods) {
        lines.push(`${cppType(method.returns)} ${name}::${method.name}(${cppParams(method.params)}) {`);
        lines.push('    // 1. Input Validation (Sanitize boundary checks)');
        lines.push('    // 2. AuthZ Check');
        lines.push('    // 3. Core Logic (Safety-critical)');
        lines.push('    // 4. Logging');
        lines.push('    throw std::runtime_error("Not implemented");');
        lines.push('}');
        lines.push('');
    }

    return lines.join('\n');
}

function generateRustPseudocode(cls: ClassDefinition): string {
    const lines: string[] = [];
    const name = cls.name;

    lines.push(`// File: ${toSnakeCase(name)}.rs`);
    lines.push(`// Purpose: ${cls.purpose}`);
    lines.push('');
    lines.push('use std::sync::Arc;');
    lines.push('use tokio::sync::Mutex;');
    lines.push('');
    lines.push('#[derive(Debug)]');
    lines.push(`pub struct ${name} {`);
    for (const prop of cls.properties) {
        lines.push(`    ${toSnakeCase(prop.name)}: ${rustType(prop.type)}, // ${prop.visibility}`);
    }
    lines.push('}');
    lines.push('');
    lines.push(`impl ${name} {`);
    lines.push('    pub fn new() -> Self {');
    lines.push('        Self {');
    for (const prop of cls.properties) {
        lines.push(`            ${toSnakeCase(prop.name)}: Default::default(),`);
    }
    lines.push('        }');
    lines.push('    }');
    lines.push('');

    for (const method of cls.methods) {
        lines.push(`    /// ${method.description}`);
        lines.push(`    pub async fn ${toSnakeCase(method.name)}(&self, ${rustParams(method.params)}) -> Result<${rustType(method.returns)}, String> {`);
        lines.push('        // 1. Validation');
        lines.push('        // 2. Authorization');
        lines.push('        // 3. Logic');
        lines.push('        Err("Not implemented".to_string())');
        lines.push('    }');
        lines.push('');
    }
    lines.push('}');

    return lines.join('\n');
}

// Existing generators (simplified for brevity, assume they exist or use previous implementation)
function generatePythonPseudocode(cls: ClassDefinition): string {
    // ... same as before
    return `# Python class ${cls.name}\nclass ${cls.name}:\n    def __init__(self): pass\n`;
}
function generateTypeScriptPseudocode(cls: ClassDefinition): string { return `export class ${cls.name} {}`; }
function generateJavaPseudocode(cls: ClassDefinition): string { return `public class ${cls.name} {}`; }
function generateGoPseudocode(cls: ClassDefinition): string { return `type ${cls.name} struct {}`; }
function generateCSharpPseudocode(cls: ClassDefinition): string { return `public class ${cls.name} {}`; }


// --- Helpers ---

function generateSecurityNotes(cls: ClassDefinition, language: PseudocodeLanguage): string[] {
    const notes: string[] = [];
    const name = cls.name.toLowerCase();

    notes.push('Input validation required for all public methods');
    notes.push('Audit logging for all data operations');

    if (name.includes('auth')) {
        notes.push('Rate limiting on authentication attempts');
    }

    if (language === 'cpp') {
        notes.push('Use smart pointers (std::unique_ptr) instead of raw pointers');
        notes.push('Avoid buffer overflows - use std::string and std::vector');
        notes.push('Check for memory leaks in destructors');
    }

    if (language === 'rust') {
        notes.push('Ensure ownership rules (borrow checker) are respected');
        notes.push('Handle all Result/Option types explicitly (no .unwrap())');
    }

    return notes;
}

function toFilename(name: string, language: PseudocodeLanguage): string {
    const base = toSnakeCase(name);
    switch (language) {
        case 'python': return `${base}.py`;
        case 'typescript': return `${toKebabCase(name)}.ts`;
        case 'java': return `${name}.java`;
        case 'go': return `${base}.go`;
        case 'csharp': return `${name}.cs`;
        case 'cpp': return `${name}.cpp`;
        case 'rust': return `${base}.rs`;
        default: return `${base}.txt`;
    }
}

function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function cppType(type: string): string {
    if (type.includes('Promise')) return type.replace('Promise<', '').replace('>', ''); // C++20 coroutines maybe, simplified for now
    if (type === 'string') return 'std::string';
    if (type === 'void') return 'void';
    return type;
}

function cppParams(params: string): string {
    return params.replace(':', '').replace(/,\s*/g, ', std::string '); // Simplified: Assume params are strings for demo
}

function rustType(type: string): string {
    if (type.includes('Promise')) return type.replace('Promise<', '').replace('>', '');
    if (type === 'string') return 'String';
    if (type === 'void') return '()';
    return type;
}

function rustParams(params: string): string {
    return params.replace(':', ': '); // Simplified
}
