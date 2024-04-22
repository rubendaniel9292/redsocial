import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'https://rubendaniel9292.github.io/redsocial/'
  //base:'/'
})
