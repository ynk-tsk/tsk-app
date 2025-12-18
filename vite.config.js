import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point imports to local shims instead of real packages
      'react-router-dom': resolve(__dirname, 'src/shims/react-router-dom.jsx'),
      'react-i18next': resolve(__dirname, 'src/shims/react-i18next.js'),
      i18next: resolve(__dirname, 'src/shims/i18next.js'),
    },
  },
})
