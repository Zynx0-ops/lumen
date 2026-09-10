import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://zynx0-ops.github.io/lumen/ — assets must resolve
  // under that subpath, not the domain root.
  base: '/lumen/',
  plugins: [react(), tailwindcss()],
})
