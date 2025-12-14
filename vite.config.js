import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom': path.resolve(__dirname, 'src/shims/react-router-dom.jsx'),
      'react-i18next': path.resolve(__dirname, 'src/shims/react-i18next.js'),
      'i18next': path.resolve(__dirname, 'src/shims/i18next.js'),
    },
  },
})
