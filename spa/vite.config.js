import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [react()],
  build: {
    // for older browser or webview?
    // or chrome66?
    target: 'es2017',
    outDir: `../dist/www`,
    emptyOutDir: true,
    // chunkSizeWarningLimit: 800,
    rollupOptions: {
      output:{
          manualChunks(id) {
              if (id.includes('node_modules')) {
                  return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
          }
      }
    }
  }
})
