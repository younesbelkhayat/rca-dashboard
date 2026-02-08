import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/rca-dashboard/', // nom de ton repo
  plugins: [react()],
})
