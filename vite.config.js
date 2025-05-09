import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    cors: true,
    strictPort: true,
    hmr: {
      host: 'oriro.org',
      clientPort: 443,
      protocol: 'wss'
    }
  }
})
