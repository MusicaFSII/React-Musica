import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  //test
  test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/setupTests.js',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    watch: {
      usePolling: true,
      ignored: ["**/node_modules/**", "**/.git/**", "**/server/**"]
    }
  }
})
