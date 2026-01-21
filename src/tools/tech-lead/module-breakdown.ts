// Tech Lead Tool - Module Breakdown Generator
import type { Feature, Module, ClassDefinition, InterfaceDefinition, MethodSignature } from '../../types/tech-lead.js';

/**
 * Generate module breakdown from features
 */
export function generateModuleBreakdown(features: Feature[], domainName?: string): Module[] {
    const modules: Module[] = [];

    for (const feature of features) {
        const module = generateModuleFromFeature(feature, domainName);
        modules.push(module);
    }

    // Add common modules
    modules.push(generateCommonModule());
    modules.push(generateSecurityModule(domainName));

    return modules;
}

/**
 * Generate module from a single feature
 */
function generateModuleFromFeature(feature: Feature, domainName?: string): Module {
    const moduleName = toModuleName(feature.name);
    const featureName = feature.name.toLowerCase();

    // [SPECIALIZED] For Secure Communication Domain
    if (domainName === 'secure_comm') {
        if (featureName.includes('signal') || featureName.includes('e2ee') || featureName.includes('encrypt') || featureName.includes('secure communication') || moduleName === 'CoreBusinessLogic' || moduleName === 'AuthenticationAuthorization') {
            return generateSecureCommModule(moduleName, feature);
        }
    }

    const module: Module = {
        name: moduleName,
        type: determineModuleType(featureName),
        classes: [],
        interfaces: [],
        dependencies: ['CommonModule']
    };

    // Generate service class
    module.classes.push(generateServiceClass(moduleName, feature));

    // Generate repository class if data-related
    if (featureName.includes('data') || featureName.includes('record') || featureName.includes('user')) {
        module.classes.push(generateRepositoryClass(moduleName));
        module.dependencies.push('DatabaseModule');
    }

    // Generate controller class
    module.classes.push(generateControllerClass(moduleName));

    // Generate interfaces
    module.interfaces.push(generateServiceInterface(moduleName));

    // Add security dependency if auth-related
    if (featureName.includes('auth') || featureName.includes('security')) {
        module.dependencies.push('SecurityModule');
    }

    return module;
}

function generateSecureCommModule(moduleName: string, feature: Feature): Module {
    const module: Module = {
        name: moduleName,
        type: 'service',
        classes: [],
        interfaces: [],
        dependencies: ['CommonModule', 'SecurityModule', 'SignalProtocolLib']
    };

    if (moduleName.includes('Auth') || moduleName.includes('Identity')) {
        module.classes.push({
            name: `${moduleName}Service`,
            purpose: 'Manages user identity keys and authentication (X3DH)',
            methods: [
                { name: 'registerIdentity', params: 'identityKey: PublicKey, signedPreKey: SignedPreKey', returns: 'Promise<void>', description: 'Publish initial key bundle' },
                { name: 'verifySession', params: 'sessionId: string, signature: string', returns: 'Promise<boolean>', description: 'Verify user session signature' },
                { name: 'rotatePreKeys', params: 'count: number', returns: 'Promise<void>', description: 'Generate and upload new one-time prekeys' }
            ],
            properties: [
                { name: 'keyStore', type: 'KeyStore', visibility: 'private' }
            ]
        });
    } else {
        // Chat / Messaging Logic
        module.classes.push({
            name: `${moduleName}Service`,
            purpose: `Secure E2EE messaging logic using Signal Protocol`,
            methods: [
                { name: 'initiateSession', params: 'recipientId: string', returns: 'Promise<SessionId>', description: 'Perform X3DH handshake' },
                { name: 'encryptMessage', params: 'sessionId: string, plaintext: string', returns: 'Promise<EncryptedMessage>', description: 'Double Ratchet encryption' },
                { name: 'decryptMessage', params: 'sessionId: string, ciphertext: EncryptedMessage', returns: 'Promise<string>', description: 'Double Ratchet decryption' },
                { name: 'handleRatchet', params: 'header: RatchetHeader', returns: 'Promise<void>', description: 'Advance chain keys' }
            ],
            properties: [
                { name: 'sessionStore', type: 'SessionStore', visibility: 'private' },
                { name: 'signalContext', type: 'SignalContext', visibility: 'private' }
            ]
        });
    }

    // Add specialized controller
    module.classes.push({
        name: `${moduleName}Controller`,
        purpose: 'Secure API endpoints',
        methods: [
            { name: 'handleHandshake', params: 'req: Request', returns: 'Promise<void>', description: 'Handle X3DH bundle request' },
            { name: 'handleMessage', params: 'req: Request', returns: 'Promise<void>', description: 'Handle encrypted message payload' }
        ],
        properties: [{ name: 'service', type: `${moduleName}Service`, visibility: 'private' }]
    });

    return module;
}

function generateServiceClass(moduleName: string, feature: Feature): ClassDefinition {
    return {
        name: `${moduleName}Service`,
        purpose: `Business logic for ${feature.name}`,
        methods: [
            {
                name: 'create',
                params: 'data: CreateDto',
                returns: 'Promise<Entity>',
                description: 'Create new record with validation'
            },
            {
                name: 'findById',
                params: 'id: string',
                returns: 'Promise<Entity | null>',
                description: 'Find record by ID'
            },
            {
                name: 'update',
                params: 'id: string, data: UpdateDto',
                returns: 'Promise<Entity>',
                description: 'Update existing record'
            },
            {
                name: 'delete',
                params: 'id: string',
                returns: 'Promise<void>',
                description: 'Soft delete record'
            }
        ],
        properties: [
            { name: 'repository', type: `${moduleName}Repository`, visibility: 'private' },
            { name: 'logger', type: 'Logger', visibility: 'private' }
        ]
    };
}

function generateRepositoryClass(moduleName: string): ClassDefinition {
    return {
        name: `${moduleName}Repository`,
        purpose: `Data access layer for ${moduleName}`,
        methods: [
            {
                name: 'save',
                params: 'entity: Entity',
                returns: 'Promise<Entity>',
                description: 'Persist entity to database'
            },
            {
                name: 'findOne',
                params: 'query: QueryOptions',
                returns: 'Promise<Entity | null>',
                description: 'Find single matching entity'
            },
            {
                name: 'findMany',
                params: 'query: QueryOptions, pagination: PaginationOptions',
                returns: 'Promise<Entity[]>',
                description: 'Find multiple entities with pagination'
            }
        ],
        properties: [
            { name: 'db', type: 'DatabaseConnection', visibility: 'private' }
        ]
    };
}

function generateControllerClass(moduleName: string): ClassDefinition {
    return {
        name: `${moduleName}Controller`,
        purpose: `HTTP/API endpoint handler for ${moduleName}`,
        methods: [
            {
                name: 'handleCreate',
                params: 'req: Request, res: Response',
                returns: 'Promise<void>',
                description: 'POST endpoint handler'
            },
            {
                name: 'handleGet',
                params: 'req: Request, res: Response',
                returns: 'Promise<void>',
                description: 'GET endpoint handler'
            },
            {
                name: 'handleUpdate',
                params: 'req: Request, res: Response',
                returns: 'Promise<void>',
                description: 'PUT/PATCH endpoint handler'
            },
            {
                name: 'handleDelete',
                params: 'req: Request, res: Response',
                returns: 'Promise<void>',
                description: 'DELETE endpoint handler'
            }
        ],
        properties: [
            { name: 'service', type: `${moduleName}Service`, visibility: 'private' },
            { name: 'validator', type: 'InputValidator', visibility: 'private' }
        ]
    };
}

function generateServiceInterface(moduleName: string): InterfaceDefinition {
    return {
        name: `I${moduleName}Service`,
        purpose: `Interface contract for ${moduleName} service`,
        methods: [
            { name: 'create', params: 'data: CreateDto', returns: 'Promise<Entity>', description: 'Create operation' },
            { name: 'findById', params: 'id: string', returns: 'Promise<Entity | null>', description: 'Find operation' },
            { name: 'update', params: 'id: string, data: UpdateDto', returns: 'Promise<Entity>', description: 'Update operation' },
            { name: 'delete', params: 'id: string', returns: 'Promise<void>', description: 'Delete operation' }
        ]
    };
}

function generateCommonModule(): Module {
    return {
        name: 'CommonModule',
        type: 'utility',
        classes: [
            {
                name: 'Logger',
                purpose: 'Centralized logging with audit trail support',
                methods: [
                    { name: 'info', params: 'message: string, context?: object', returns: 'void', description: 'Info level log' },
                    { name: 'error', params: 'message: string, error?: Error', returns: 'void', description: 'Error level log' },
                    { name: 'audit', params: 'action: string, userId: string, details: object', returns: 'void', description: 'Audit log for compliance' }
                ],
                properties: []
            },
            {
                name: 'InputValidator',
                purpose: 'Input validation and sanitization',
                methods: [
                    { name: 'validate', params: 'data: unknown, schema: Schema', returns: 'ValidationResult', description: 'Validate input against schema' },
                    { name: 'sanitize', params: 'input: string', returns: 'string', description: 'Sanitize user input' }
                ],
                properties: []
            }
        ],
        interfaces: [],
        dependencies: []
    };
}

function generateSecurityModule(domainName?: string): Module {
    if (domainName === 'secure_comm') {
        return {
            name: 'SecurityModule',
            type: 'service',
            classes: [
                {
                    name: 'SignalProtocolService',
                    purpose: 'Core Signal Protocol implementation wrapper',
                    methods: [
                        { name: 'x3dh_handshake', params: 'peer_bundle: PreKeyBundle', returns: 'Result<Session>', description: 'Perform X3DH Agreement' },
                        { name: 'double_ratchet_encrypt', params: 'state: SessionState, msg: bytes', returns: 'Result<Ciphertext>', description: 'Encrypt with ratchet advancement' },
                        { name: 'double_ratchet_decrypt', params: 'state: SessionState, msg: Ciphertext', returns: 'Result<bytes>', description: 'Decrypt with ratchet advancement' }
                    ],
                    properties: []
                },
                {
                    name: 'KeyTransferService',
                    purpose: 'Secure file key exchange',
                    methods: [
                        { name: 'generate_ephemeral_key', params: '', returns: 'Key', description: 'Generate file-specific key' },
                        { name: 'encrypt_key_for_recipient', params: 'file_key: Key, recipient_pub: PublicKey', returns: 'EncryptedKey', description: 'Wrap key for recipient' }
                    ],
                    properties: []
                }
            ],
            interfaces: [],
            dependencies: ['libsodium', 'signal-protocol-rs']
        };
    }

    return {
        name: 'SecurityModule',
        type: 'service',
        classes: [
            {
                name: 'AuthService',
                purpose: 'Authentication handling',
                methods: [
                    { name: 'authenticate', params: 'credentials: Credentials', returns: 'Promise<AuthToken>', description: 'Verify user credentials' },
                    { name: 'validateToken', params: 'token: string', returns: 'Promise<TokenPayload>', description: 'Validate JWT token' },
                    { name: 'refreshToken', params: 'refreshToken: string', returns: 'Promise<AuthToken>', description: 'Refresh access token' }
                ],
                properties: [
                    { name: 'tokenManager', type: 'TokenManager', visibility: 'private' },
                    { name: 'hasher', type: 'PasswordHasher', visibility: 'private' }
                ]
            },
            {
                name: 'AuthorizationService',
                purpose: 'Role-based access control',
                methods: [
                    { name: 'checkPermission', params: 'userId: string, resource: string, action: string', returns: 'Promise<boolean>', description: 'Check if user has permission' },
                    { name: 'getUserRoles', params: 'userId: string', returns: 'Promise<Role[]>', description: 'Get user roles' }
                ],
                properties: []
            }
        ],
        interfaces: [
            {
                name: 'IAuthProvider',
                purpose: 'Authentication provider interface',
                methods: [
                    { name: 'authenticate', params: 'credentials: Credentials', returns: 'Promise<AuthResult>', description: 'Authenticate user' }
                ]
            }
        ],
        dependencies: ['CommonModule', 'DatabaseModule']
    };
}

function toModuleName(name: string): string {
    return name
        .split(/[\s&]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

function determineModuleType(name: string): Module['type'] {
    if (name.includes('util') || name.includes('common') || name.includes('helper')) {
        return 'utility';
    }
    if (name.includes('data') || name.includes('repository')) {
        return 'repository';
    }
    if (name.includes('controller') || name.includes('api')) {
        return 'controller';
    }
    return 'service';
}
