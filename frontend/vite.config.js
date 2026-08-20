import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    react(),
  ],
  // @base44/vite-plugin used to provide this alias (matches jsconfig.json's
  // "@/*" -> "./src/*" paths) alongside its Base44-specific features.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});