import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI components chunk
          ui: [
            './src/components/ui/Button/Button.jsx',
            './src/components/ui/FormField/FormField.jsx',
            './src/components/ui/Hero/Hero.jsx',
            './src/components/ui/FeatureList/FeatureList.jsx',
            './src/components/ui/CTASection/CTASection.jsx',
          ],
        },
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  // CSS code splitting
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  // Optimization for dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
