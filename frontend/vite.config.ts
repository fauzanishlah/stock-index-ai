import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from 'tailwindcss'

import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
  // css: {
  //   postcss: {
  //     plugins: [
  //       require('tailwindcss'),
  //     ],
  //   },
  // }
})
