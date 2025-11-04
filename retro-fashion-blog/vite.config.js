import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define the absolute path to your 'src' folder
const srcPath = path.resolve(__dirname, 'src');

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    open: true // don't auto-open browser
  },
  resolve: {
    alias: {
      // Must be path.resolve()
      '@': srcPath,
      '@components': path.resolve(srcPath, 'components'),
      '@assets': path.resolve(srcPath, 'assets'),
      // Alias for the base SCSS folder
      '@scss': path.resolve(srcPath, 'assets/scss'),
      '@layouts': path.resolve(srcPath, 'components/StandardLayout'),
      '@pages': path.resolve(srcPath, 'pages'),
      '@utils': path.resolve(srcPath, 'utils'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          // ✅ FIX 1: Add the base SCSS folder
          path.resolve(srcPath, 'assets/scss'),
          // ✅ FIX 2: Add the correct 'utilities' folder (single 'l')
          path.resolve(srcPath, 'assets/scss/utilities')
        ]
      }
    }
  }
});