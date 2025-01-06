import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/slp': {
        target: 'http://www.scorelynxpro.com',
        changeOrigin: true
      }
    }
  }
})