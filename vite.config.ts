import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    crx({
      manifest
    })
  ],
  build: {
    sourcemap: true
  },
  server: {
    // use a fixed port and explicit HMR config so the extension's HMR client sees a valid WS URL
    port: 5173,
    // fail if the port is already used (helps prevent Vite from picking another port and confusing the extension)
    strictPort: true,
    // enable CORS and add headers so chrome-extension:// origins can fetch dev loader files
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      // ensure the client and server use the same port
      port: 5173,
      clientPort: 5173
    }
  }
})
