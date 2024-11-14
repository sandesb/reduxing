import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public', // Ensures Vite uses the root public folder

  plugins: [
    
    react()
  ],
})
