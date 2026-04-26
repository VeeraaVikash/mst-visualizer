import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { target: 'esnext', sourcemap: false },
  server: {
    // SPA fallback: all routes serve index.html in dev
    historyApiFallback: true,
  },
})
