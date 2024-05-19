import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line
      '@/theme': path.resolve(__dirname, 'src/utils/theme'),
      // eslint-disable-next-line
      '@/utils': path.resolve(__dirname, 'src/utils'),
      // eslint-disable-next-line
      '@/firestore': path.resolve(__dirname, 'src/utils/firestore'),
      // eslint-disable-next-line
      '@/zustand': path.resolve(__dirname, 'src/utils/zustand'),
      // eslint-disable-next-line
      '@/hooks': path.resolve(__dirname, 'src/utils/hooks'),
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
});
