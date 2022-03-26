import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// const reactRefresh = require("@vitejs/plugin-react-refresh")
const reactSvgPlugin = require("vite-plugin-react-svg")

export default defineConfig({
  server: { port: 3013 },
  plugins: [react(), reactSvgPlugin({ defaultExport: "component", expandProps: "start" })],
})
