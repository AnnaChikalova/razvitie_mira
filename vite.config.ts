import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path только для production (GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? '/dukhovnoye_razvitiye/' : '/',
})



