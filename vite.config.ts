import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const srcPath = decodeURIComponent(new URL('./src', import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');

export default defineConfig({
  plugins: [react()],
  cacheDir: '.vite-cache',
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': srcPath,
    },
  },
});
