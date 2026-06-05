import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
