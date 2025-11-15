import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // ★ 외부 접속 허용
    port: 3000,           // ★ 컨테이너 내부 Vite 포트
    strictPort: true
  }
})
