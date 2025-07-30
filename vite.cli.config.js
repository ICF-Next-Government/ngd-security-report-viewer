import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// Determine entry point based on environment variable
const entryFile =
  process.env.CLI_ENTRY === "report-summary"
    ? "src/cli/report-summary.ts"
    : "src/cli/generate-html-report.ts";
const fileName =
  process.env.CLI_ENTRY === "report-summary"
    ? "report-summary"
    : "generate-html-report";

// Vite configuration for building the CLI as a standalone executable
export default defineConfig({
  plugins: [
    // Automatically read TypeScript path aliases from tsconfig files
    tsconfigPaths({
      root: ".",
      projects: ["./tsconfig.app.json"],
    }),
  ],
  build: {
    // Build for Node.js environment
    target: "node16",
    // Output as CommonJS for better Node.js compatibility
    lib: {
      entry: resolve(__dirname, entryFile),
      name: fileName,
      fileName: fileName,
      formats: ["cjs"],
    },
    rollupOptions: {
      // Mark Node.js built-ins as external
      external: [
        "node:fs/promises",
        "node:path",
        "node:process",
        "fs",
        "path",
        "process",
      ],
      output: {
        // Ensure the output is executable
        banner: "#!/usr/bin/env node",
      },
    },
    // Output to dist directory
    outDir: "dist",
    // Clear the output directory before building
    emptyOutDir: false,
    // Generate source maps for debugging
    sourcemap: true,
  },
  // Don't include any dependencies in the bundle - resolve them at runtime
  define: {
    // Ensure process.env is available
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
