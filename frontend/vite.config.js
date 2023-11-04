import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://face-detect-server.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
