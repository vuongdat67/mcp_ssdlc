import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'coverage/**',
            'tests/**',
            '*.config.js',
            '*.config.ts',
            'test-*.js',
            'bin/**'
        ]
    },
    {
        files: ['src/**/*.ts'],
        rules: {
            // relaxed rules for legacy code compatibility
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'no-console': 'off',
            'prefer-const': 'warn',
            '@typescript-eslint/no-require-imports': 'off'
        }
    }
);
