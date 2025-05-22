import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Add base URL configuration
  base: '/',
  // Ensure public directory assets are served correctly
  publicDir: 'public',
  // Add SPA fallback
  server: {
    historyApiFallback: true,
  },
  build: {
    // Generate SPA fallback
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});