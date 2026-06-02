import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/service-connect-cloud/', // Sets the correct base path for GitHub Pages subfolder hosting
  server: {
    port: 3000,
    host: true
  }
});
