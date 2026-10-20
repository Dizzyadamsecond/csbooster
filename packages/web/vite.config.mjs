import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('framer-motion')) return 'vendor-framer';
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('node_modules')) return 'vendor';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        include: [
          path.resolve(__dirname, 'src', 'styles', 'tokens.css'),
        ],
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
