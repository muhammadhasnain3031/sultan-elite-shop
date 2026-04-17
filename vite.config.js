import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './', // Ye Vercel ko bataye ga ke files bahir hi pari hain
})
