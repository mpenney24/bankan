import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./vitest.setup.ts'],
        testTimeout: 300_000,
        exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    },
});
