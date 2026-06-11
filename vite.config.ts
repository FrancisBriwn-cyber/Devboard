import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/devto': {
        target: 'https://dev.to',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devto/, ''),
      },
    },
  },
})
