import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@theme': path.resolve(__dirname, 'src/utils/theme'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
});
