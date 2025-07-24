import { existsSync } from "fs";
import { extname, join, resolve } from "path";
import { serve } from "bun";
import { file } from "bun";

const PORT = process.env.PORT || 9876;
const DIST_DIR = "./dist";

// Simple logging utility
const log = {
  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  },
  info: (message: string) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  error: (message: string) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },
};

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
  hostname: "0.0.0.0",
  async fetch(req) {
    const startTime = Date.now();
    const clientIP =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    try {
      const url = new URL(req.url);
      let pathname = url.pathname;

      log.debug(`${req.method} ${pathname} - IP: ${clientIP}`);

      // Remove leading slash and decode URI
      try {
        pathname = decodeURIComponent(pathname.slice(1));
      } catch (decodeError) {
        log.warn(`Invalid URL encoding for path: ${pathname}`);
        return new Response("Bad Request - Invalid URL encoding", {
          status: 400,
        });
      }

      // Default to index.html for root path
      if (pathname === "" || pathname === "/") {
        pathname = "index.html";
      }

      // Construct full file path
      const filePath = resolve(join(DIST_DIR, pathname));
      const distPath = resolve(DIST_DIR);

      // Security check: ensure the resolved path doesn't escape the dist directory
      if (!filePath.startsWith(distPath + "/") && filePath !== distPath) {
        log.warn(`Path traversal attempt blocked: ${pathname} (IP: ${clientIP})`);
        return new Response("Forbidden - Path traversal not allowed", {
          status: 403,
        });
      }

      // Check if file exists
      const fileExists = existsSync(filePath);

      if (fileExists) {
        try {
          // Serve the file
          const fileContent = file(filePath);
          const mimeType = getMimeType(filePath);

          log.debug(`Serving file: ${pathname} (${mimeType})`);

          return new Response(fileContent, {
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": pathname.includes(".") ? "public, max-age=31536000" : "no-cache",
              "X-Content-Type-Options": "nosniff",
              "X-Frame-Options": "DENY",
              "X-XSS-Protection": "1; mode=block",
            },
          });
        } catch (fileError) {
          log.error(`Failed to read file ${filePath}: ${fileError}`);
          return new Response("Internal Server Error - File read failed", {
            status: 500,
          });
        }
      }

      // For SPA routing, try to serve index.html for non-asset requests
      const indexPath = join(DIST_DIR, "index.html");
      const indexExists = existsSync(indexPath);

      if (indexExists && !pathname.includes(".")) {
        try {
          const indexFile = file(indexPath);
          log.debug(`Serving SPA fallback: index.html for ${pathname}`);

          return new Response(indexFile, {
            headers: {
              "Content-Type": "text/html",
              "Cache-Control": "no-cache",
              "X-Content-Type-Options": "nosniff",
              "X-Frame-Options": "DENY",
              "X-XSS-Protection": "1; mode=block",
            },
          });
        } catch (indexError) {
          log.error(`Failed to read index.html: ${indexError}`);
          return new Response("Internal Server Error - Index file read failed", { status: 500 });
        }
      }

      // File not found
      log.debug(`File not found: ${pathname}`);
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      log.error(
        `Server error (${processingTime}ms): ${error instanceof Error ? error.message : String(error)}`,
      );

      if (error instanceof Error) {
        log.error(`Stack trace: ${error.stack}`);
      }

      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } finally {
      const processingTime = Date.now() - startTime;
      if (processingTime > 100) {
        // Log slow requests
        log.warn(`Slow request: ${req.method} ${req.url} took ${processingTime}ms`);
      }
    }
  },
});

// Startup validation
if (!existsSync(DIST_DIR)) {
  log.error(`Distribution directory not found: ${DIST_DIR}`);
  log.error("Please run 'bun run build' to create the distribution files");
  process.exit(1);
}

const indexPath = join(DIST_DIR, "index.html");
if (!existsSync(indexPath)) {
  log.error(`Index file not found: ${indexPath}`);
  log.error("Please ensure the build process completed successfully");
  process.exit(1);
}

log.info(`🚀 Server starting on http://localhost:${PORT}`);
log.info(`📁 Serving files from: ${resolve(DIST_DIR)}`);
log.info(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
log.info(`📊 Debug logging: ${process.env.DEBUG ? "enabled" : "disabled"}`);

// Log available files for debugging
if (process.env.DEBUG) {
  try {
    const files = require("fs").readdirSync(DIST_DIR);
    log.debug(`Available files: ${files.join(", ")}`);
  } catch (err) {
    log.warn("Could not list directory contents");
  }
}

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  log.info(`\n🛑 Received ${signal}, shutting down gracefully...`);

  server.stop();

  // Give the server a moment to finish handling requests
  setTimeout(() => {
    log.info("✅ Server shutdown complete");
    process.exit(0);
  }, 1000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  log.error(`Uncaught Exception: ${error.message}`);
  log.error(`Stack: ${error.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});
