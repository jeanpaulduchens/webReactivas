import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001' // Cambia el puerto si tu backend usa otro
    }
  },
  resolve: {
    alias: {
      // allows imports like: import X from '@components/X'
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@api': '/src/api',
      '@utils': '/src/utils',
      '@static': '/src/static',
    },
  },
})
