import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"
// const reactRefresh = require("@vitejs/plugin-react-refresh")
const reactSvgPlugin = require("vite-plugin-react-svg")

export default defineConfig({
  server: { port: 3013 },
  plugins: [react(), reactSvgPlugin({ defaultExport: "component", expandProps: "start" })],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        decrypto: resolve(__dirname, "decrypto/index.html"),
        card_sandbox: resolve(__dirname, "card_sandbox/index.html"),
      },
    },
  },
})
