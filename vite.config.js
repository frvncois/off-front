import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Enable history API fallback for development
    historyApiFallback: true,
  },
  build: {
    // Ensure proper handling of routing in production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
