import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base:
//   - GitHub Pages 배포 시: deploy workflow에서 VITE_BASE_PATH=/<repo>/ 주입
//   - Vercel/Netlify/로컬: '/' (기본값)
export default defineConfig(() => ({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
}))
