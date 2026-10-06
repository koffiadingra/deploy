import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Le plugin tailwindcss() génère le CSS au build en scannant les sources.
// Sans lui, aucune nouvelle classe utilitaire n'est produite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // attendu par Vercel
  },
  server: {
    port: 3000,
    open: true,
  },
});
