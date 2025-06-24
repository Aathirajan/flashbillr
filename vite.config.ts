import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
 
  plugins: [
    react({
      // Use the new JSX transform
      jsxRuntime: 'automatic',
      // Fast refresh is enabled by default in Vite
    })
  ],
  resolve: {
    alias: {
      // Use ESM version of lucide-react
      'lucide-react': 'lucide-react/dist/esm/lucide-react.js',
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // Enable tree shaking
      treeShaking: true,
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable source maps in production
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor and app code
          vendor: ['react', 'react-dom'],
          // Split lucide-react into a separate chunk
          lucide: ['lucide-react'],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  // Improve development server performance
  server: {
    fs: {
      strict: true,
    },
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false, // Disable source maps in development
  },
});
