import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Image-Aspect-Ratio-Comparison-Tool/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
})
