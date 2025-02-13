import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isProduction ? '/slp_web/' : '/',  // Use different base for dev/prod
  server: {
    proxy: {
      '/slp': {
        target: 'http://www.scorelynxpro.com',
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: false  // Disable the error overlay
    }
  }
})