import { Feature, FileStructure } from '../../types/tech-lead.js';

export function generateProjectStructure(domainName?: string): FileStructure[] {
    console.log(`[DEBUG] generateProjectStructure called with domainName: '${domainName}'`);
    if (domainName === 'secure_comm') {
        return generateSecureCommStructure();
    }
    return generateDefaultStructure();
}

function generateSecureCommStructure(): FileStructure[] {
    return [
        {
            name: 'src',
            type: 'directory',
            children: [
                {
                    name: 'signal',
                    type: 'directory',
                    description: 'Signal Protocol Core Implementation',
                    children: [
                        { name: 'x3dh.rs', type: 'file', description: 'X3DH Key Agreement Logic (Alice/Bob Handshake)' },
                        { name: 'double_ratchet.rs', type: 'file', description: 'Double Ratchet Encrypt/Decrypt State Machine' },
                        { name: 'session_store.rs', type: 'file', description: 'Secure Storage for Ratchet Keys and State' },
                        { name: 'prekey_manager.rs', type: 'file', description: 'PreKey Bundle Generation & Rotation' },
                        { name: 'cipher.rs', type: 'file', description: 'AEAD Primitive Wrappers (AES-GCM/ChaCha20)' }
                    ]
                },
                {
                    name: 'messaging',
                    type: 'directory',
                    description: 'High-level Messaging Logic',
                    children: [
                        { name: 'queue_manager.rs', type: 'file', description: 'Handle Out-of-Order Messages' },
                        { name: 'delivery_receipts.rs', type: 'file', description: 'E2EE Delivery Receipts Logic' },
                        { name: 'typing_indicators.rs', type: 'file', description: 'Encrypted Typing Indicators' }
                    ]
                },
                {
                    name: 'network',
                    type: 'directory',
                    description: 'Network Layer (Transport)',
                    children: [
                        { name: 'websocket_client.rs', type: 'file', description: 'Real-time Socket Connection' },
                        { name: 'api_client.rs', type: 'file', description: 'REST Client for PreKey Server' }
                    ]
                },
                {
                    name: 'storage',
                    type: 'directory',
                    description: 'Local Data Persistence',
                    children: [
                        { name: 'encrypted_db.rs', type: 'file', description: 'SQLCipher/SQLite Wrapper with Key' },
                        { name: 'migrations.rs', type: 'file', description: 'Database Schema Migrations' }
                    ]
                },
                { name: 'main.rs', type: 'file', description: 'Application Entry Point' }
            ]
        },
        {
            name: 'tests',
            type: 'directory',
            description: 'Integration & Security Tests',
            children: [
                { name: 'security_tests.rs', type: 'file', description: 'Test Vectors for Crypto Primitives' },
                { name: 'e2e_tests.rs', type: 'file', description: 'Full Client-to-Client Flow Tests' }
            ]
        },
        { name: 'Cargo.toml', type: 'file', description: 'Rust Dependencies' },
        { name: 'README.md', type: 'file', description: 'Project Documentation' }
    ];
}

function generateDefaultStructure(): FileStructure[] {
    return [
        {
            name: 'src',
            type: 'directory',
            children: [
                { name: 'services', type: 'directory' },
                { name: 'controllers', type: 'directory' },
                { name: 'models', type: 'directory' },
                { name: 'utils', type: 'directory' },
                { name: 'index.ts', type: 'file' }
            ]
        },
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file' }
    ];
}
