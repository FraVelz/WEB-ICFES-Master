import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __process = globalThis.process || { env: { NODE_ENV: 'development' } }

// https://vite.dev/config/
export default defineConfig({
  // Para Firebase Hosting (y desarrollo local estándar), la base debe ser '/'
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
