import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Automatically read TypeScript path aliases from tsconfig files
    // This ensures @/* imports work correctly in both dev and test environments
    tsconfigPaths({
      root: ".",
      projects: ["./tsconfig.app.json"],
    }),
  ],
  base: "./",
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setupTests.ts",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    },
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    watch: false,
  },
});
