import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts") || id.includes("d3-")) return "recharts";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("react-router")) return "router";
            if (id.includes("react-dom") || id.includes("/react/")) return "vendor";
          }
        },
      },
    },
  },
})
