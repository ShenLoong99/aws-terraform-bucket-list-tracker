import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // This polyfills 'global' which is needed by some AWS SDKs
    global: {},
  },
})