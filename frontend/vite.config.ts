import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:8080",
          changeOrigin: true
        },
        "/ws": {
          target: env.VITE_API_URL ?? "http://localhost:8080",
          ws: true
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify("0.1.0")
    }
  };
});


