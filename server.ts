import { serve } from "bun";
import { file } from "bun";
import { join, extname, resolve } from "path";
import { existsSync } from "fs";

const PORT = process.env.PORT || 9876;
const DIST_DIR = "./dist";

// MIME type mapping for common web assets
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

const server = serve({
  port: PORT,
  async fetch(req) {
    try {
      const url = new URL(req.url);
      let pathname = url.pathname;

      // Remove leading slash and decode URI
      pathname = decodeURIComponent(pathname.slice(1));

      // Default to index.html for root path
      if (pathname === "" || pathname === "/") {
        pathname = "index.html";
      }

      // Construct full file path
      const filePath = resolve(join(DIST_DIR, pathname));
      const distPath = resolve(DIST_DIR);

      // Security check: ensure the resolved path doesn't escape the dist directory
      if (!filePath.startsWith(distPath + "/") && filePath !== distPath) {
        return new Response("Forbidden", { status: 403 });
      }

      // Check if file exists
      const fileExists = existsSync(filePath);

      if (fileExists) {
        // Serve the file
        const fileContent = file(filePath);
        const mimeType = getMimeType(filePath);

        return new Response(fileContent, {
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000", // 1 year cache for assets
          },
        });
      } else {
        // For SPA routing, try to serve index.html for non-asset requests
        const indexPath = join(DIST_DIR, "index.html");
        const indexExists = existsSync(indexPath);

        if (indexExists && !pathname.includes(".")) {
          const indexFile = file(indexPath);
          return new Response(indexFile, {
            headers: {
              "Content-Type": "text/html",
              "Cache-Control": "no-cache", // Don't cache HTML files
            },
          });
        }

        // File not found
        return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("Server error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
console.log(`📁 Serving files from: ${DIST_DIR}`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down server...");
  server.stop();
  process.exit(0);
});
