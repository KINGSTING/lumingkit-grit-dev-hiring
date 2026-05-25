import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ◄--- Import the native v4 compiler plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ◄--- Register it directly in the asset pipeline pipeline
  ],
  server: {
    host: true,
    port: 5173,
  }
})