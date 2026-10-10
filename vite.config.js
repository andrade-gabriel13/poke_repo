import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // No GitHub Pages o site fica em https://<usuario>.github.io/poke_repo/,
  // então o build (e o `npm run preview`) usam esse caminho base. Em dev continua na raiz.
  base: command === 'build' || isPreview ? '/poke_repo/' : '/',
}))
