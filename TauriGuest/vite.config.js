import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const tauriHost = process.env.TAURI_DEV_HOST;
const isTauri = !!process.env.TAURI_PLATFORM;

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],

  // Для обычного веба поднимаем Vite на 3000,
  // для Tauri оставляем 1420, как ожидает Tauri.
  clearScreen: false,
  server: {
    port: isTauri ? 1420 : 3000,
    strictPort: true,
    host: isTauri ? tauriHost || "127.0.0.1" : "127.0.0.1",
    hmr: isTauri
      ? {
          protocol: "ws",
          host: tauriHost || "127.0.0.1",
          port: 1421,
        }
      : true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
