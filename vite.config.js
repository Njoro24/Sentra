import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// SPA fallback plugin
const spaFallback = () => ({
  name: 'spa-fallback',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && !req.url.includes('.') && !req.url.startsWith('/api')) {
          req.url = '/index.html'
        }
        next()
      })
    }
  }
})

export default defineConfig({
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false
    }
  },
  preview: {
    port: 3000
  }
})
