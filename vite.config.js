import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages: repo name이 shorts-insight인 경우
  base: command === 'build' ? '/shorts-insight/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
}))
