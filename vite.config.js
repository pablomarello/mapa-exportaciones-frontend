import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ui/',
  build: {
    outDir: 'dist'
  },
  publicDir:'public',
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.jpeg', '**/*.jfif', '**/*.png', '**/*.avif']
})
