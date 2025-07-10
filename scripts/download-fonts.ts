#!/usr/bin/env bun
/**
 * Script to download and embed fonts as base64 data URLs
 * This pre-generates the embedded font data for offline usage
 */

import { writeFileSync } from "fs";
import { join } from "path";

const INTER_FONT_URLS = [
  {
    weight: 400,
    style: "normal",
    url: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff2",
  },
  {
    weight: 500,
    style: "normal",
    url: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-500-normal.woff2",
  },
  {
    weight: 600,
    style: "normal",
    url: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-600-normal.woff2",
  },
  {
    weight: 700,
    style: "normal",
    url: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-700-normal.woff2",
  },
];

async function fetchFontAsBase64(url: string): Promise<string> {
  console.log(`Fetching font from: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:font/woff2;base64,${base64}`;
}

async function downloadAndGenerateFonts() {
  console.log("Starting font download...\n");

  const fontData: Array<{ weight: number; style: string; data: string }> = [];

  for (const font of INTER_FONT_URLS) {
    try {
      const dataUrl = await fetchFontAsBase64(font.url);
      fontData.push({
        weight: font.weight,
        style: font.style,
        data: dataUrl,
      });
      console.log(`✓ Downloaded Inter ${font.weight} (${font.style})`);
    } catch (error) {
      console.error(`✗ Failed to download Inter ${font.weight}:`, error);
    }
  }

  if (fontData.length === 0) {
    console.error("No fonts could be downloaded!");
    process.exit(1);
  }

  // Generate the TypeScript file with embedded fonts
  const fontFaces = fontData
    .map(
      (font) => `
  @font-face {
    font-family: 'Inter';
    font-style: ${font.style};
    font-weight: ${font.weight};
    font-display: swap;
    src: url('${font.data}') format('woff2');
  }`,
    )
    .join("\n");

  const tsContent = `/**
 * Pre-generated embedded Inter fonts for offline usage
 * Generated on: ${new Date().toISOString()}
 *
 * To regenerate: bun run scripts/download-fonts.ts
 */

export const EMBEDDED_INTER_FONTS = \`${fontFaces}\`;

export const EMBEDDED_FONT_DATA = ${JSON.stringify(fontData, null, 2)};
`;

  const outputPath = join(process.cwd(), "src/utils/fonts/embeddedFonts.ts");
  writeFileSync(outputPath, tsContent);

  console.log(`\n✓ Generated embedded fonts file at: ${outputPath}`);
  console.log(`Total fonts embedded: ${fontData.length}`);

  // Calculate total size
  const totalSize = fontData.reduce((sum, font) => sum + font.data.length, 0);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

// Run the script
downloadAndGenerateFonts().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
