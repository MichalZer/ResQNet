import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ייצוא יחיד ומאוחד שמכיל את כל הפלאגינים יחד
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})