#!/usr/bin/env bun
/**
 * Script to inject embedded fonts into the built HTML for offline usage
 * This ensures the static HTML works without internet connection
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Import the embedded fonts
import { EMBEDDED_INTER_FONTS } from "../src/utils/fonts/embeddedFonts.js";

async function injectFontsIntoHtml() {
  console.log("🔤 Starting font injection into built HTML...");

  const distPath = join(process.cwd(), "dist");
  const htmlPath = join(distPath, "index.html");

  if (!existsSync(htmlPath)) {
    console.error("❌ Error: dist/index.html not found. Please build the project first.");
    console.error("   Run: bun run build");
    process.exit(1);
  }

  console.log("📖 Reading HTML file...");
  let html = readFileSync(htmlPath, "utf8");

  // Check if fonts are already embedded
  if (html.includes("/* Embedded Inter fonts for offline usage */")) {
    console.log("🔄 Fonts already embedded, updating...");
    // Remove existing embedded fonts
    html = html.replace(/<style id="embedded-fonts">[\s\S]*?<\/style>/g, "");
  }

  // Create the font style tag
  const fontStyleTag = `<style id="embedded-fonts">
    /* Embedded Inter fonts for offline usage */
    ${EMBEDDED_INTER_FONTS}

    /* Ensure Inter font is used throughout the application */
    :root {
      --font-family-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    /* Override default font families */
    html, body {
      font-family: var(--font-family-sans) !important;
    }

    /* Override Tailwind CSS defaults */
    .font-sans {
      font-family: var(--font-family-sans) !important;
    }

    /* Override button and input fonts */
    button, input, optgroup, select, textarea {
      font-family: inherit !important;
    }

    /* Override headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-family-sans) !important;
    }
  </style>`;

  // Inject the font styles into the head
  if (html.includes("</head>")) {
    html = html.replace("</head>", `  ${fontStyleTag}\n</head>`);
  } else {
    console.error("❌ Error: Could not find </head> tag in HTML");
    process.exit(1);
  }

  // Write the modified HTML back
  console.log("💾 Writing modified HTML...");
  writeFileSync(htmlPath, html);

  console.log("✅ Successfully injected embedded fonts into HTML!");
  console.log("📊 Font injection summary:");
  console.log(`   - Font families: Inter (400, 500, 600, 700 weights)`);
  console.log(`   - Format: WOFF2 (base64 embedded)`);
  console.log(`   - File: ${htmlPath}`);
  console.log(`   - Size: ${(html.length / 1024).toFixed(1)}KB`);

  // Calculate embedded font size
  const fontDataSize = EMBEDDED_INTER_FONTS.length;
  console.log(`   - Embedded font data: ${(fontDataSize / 1024).toFixed(1)}KB`);

  console.log("\n🎉 The HTML file is now ready for offline usage!");
  console.log("   All Inter fonts are embedded and will work without internet connection.");
}

// Handle errors gracefully
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});

// Run the script
injectFontsIntoHtml().catch((error) => {
  console.error("❌ Error injecting fonts:", error);
  process.exit(1);
});
