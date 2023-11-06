import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": "https://walkytalky-r0fb.onrender.com:8080",
    },
  },
  plugins: [react()],
});
