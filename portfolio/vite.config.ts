import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Doc officielle : https://tailwindcss.com/docs/installation/using-vite
// Le plugin `tailwindcss()` scanne les fichiers source et GENERE le CSS au build.
// Sans lui, aucune nouvelle classe utilitaire Tailwind n'est produite.
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
    outDir: 'dist', // dossier de sortie attendu par Vercel
  },
  server: {
    port: 3000,
    open: true,
  },
});
