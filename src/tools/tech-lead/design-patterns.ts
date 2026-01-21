
export interface DesignPattern {
    name: string;
    description: string;
    justification: string;
    tradeoffs?: string[];
}

export function generateDesignPatterns(domainName?: string): DesignPattern[] {
    if (domainName === 'secure_comm') {
        return [
            {
                name: 'Double Ratchet Algorithm',
                description: 'Cryptographic key management protocol that provides forward secrecy and future secrecy for asynchronous messaging.',
                justification: 'Essential for E2EE chat to ensure that compromise of one message key does not compromise past or future messages.',
                tradeoffs: ['Complexity in state management', 'Message ordering dependency']
            },
            {
                name: 'X3DH (Extended Triple Diffie-Hellman)',
                description: 'Key agreement protocol that establishes a shared secret key between two parties who mutually authenticate each other.',
                justification: 'Provides asynchronous mutual authentication and forward secrecy for initial session setup.',
                tradeoffs: ['Requires PreKey server availability']
            },
            {
                name: 'Sesame Algorithm',
                description: 'Variant of Double Ratchet for multi-device support.',
                justification: 'Allows users to have multiple devices (phone, laptop) with synchronized message history securely.',
                tradeoffs: ['Increased bandwidth (N messages per device)']
            },
            {
                name: 'Zero-Knowledge Proofs',
                description: 'Authentication method where one party proves to another that they know a value x, without conveying any information apart from the fact that they know the value x.',
                justification: 'Used for secure password authentication (SRP) without sending passwords over the wire.',
                tradeoffs: ['Computationally intensive']
            }
        ];
    }

    // Default patterns for generic systems
    return [
        {
            name: 'Layered Architecture',
            description: 'Organizes the application into logical layers (Presentation, Business, Data).',
            justification: 'Separation of concerns, modularity, and maintainability.',
            tradeoffs: ['Can increase code volume']
        },
        {
            name: 'Repository Pattern',
            description: 'Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.',
            justification: 'Decouples business logic from data access implementation.',
            tradeoffs: ['Abstractions can leak']
        }
    ];
}
