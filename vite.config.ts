import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2022' },
  resolve: { dedupe: ['react', 'react-dom'] },
  test: { include: ['harness/**/*.test.ts'] },
})
