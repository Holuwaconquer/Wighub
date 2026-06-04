import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Aos from 'aos'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
<<<<<<< HEAD
  ],
  server: {
    port: 5173,
    open: true,
  }
=======
  ]
>>>>>>> 0896d2a31570b6b192b80c5ff933cd36f3fe7230
})
