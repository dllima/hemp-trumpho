import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hemp-trumpho/engine': path.resolve(__dirname, '../engine/dist/index.js'),
    },
  },
})
