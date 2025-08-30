import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 nombre EXACTO del repo (sensible a mayúsculas/minúsculas)
  base: '/CarteleraDeCines-React-Vite/',
})
