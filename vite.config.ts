import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('firebase')) {
                            return 'vendor-firebase';
                        }
                        if (id.includes('react') || id.includes('scheduler')) {
                            return 'vendor-react';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
