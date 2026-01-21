import { vi } from 'vitest';

// Mock console.error for MCP server startup messages
vi.spyOn(console, 'error').mockImplementation(() => { });

// Reset mocks after each test
afterEach(() => {
    vi.clearAllMocks();
});
