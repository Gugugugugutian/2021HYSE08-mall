import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        followRedirects: true, // 允许跨域解决cookie问题
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // headers: {
    //     'Access-Control-Allow-Origin': 'http://localhost:5173/',
    //     "Access-Control-Allow-Credentials": "true",
    // }
  }
})
