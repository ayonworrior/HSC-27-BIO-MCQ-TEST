
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the code to use 'process.env.API_KEY' directly as requested.
    // Vite replaces this string at build time with the value from the environment.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
});
