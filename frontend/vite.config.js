import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Native v4 compiler plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Registered cleanly in the core asset pipeline
  ],
  server: {
    host: true, // Exposes the server to the local network architecture inside Docker
    port: 5173,
    watch: {
      usePolling: true // Forces polling fallback so local file modifications track across Linux volumes
    },
    hmr: {
      clientPort: 5173, // Redirects browser WebSocket handshake back down to host port maps
    }
  }
})