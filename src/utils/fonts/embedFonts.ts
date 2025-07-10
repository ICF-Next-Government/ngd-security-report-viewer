/**
 * Utility to fetch and embed fonts as base64 data URLs for offline usage
 */

export interface FontData {
  weight: number;
  style: string;
  data: string;
}

/**
 * Inter font subset covering Latin characters (woff2 format)
 * These are the most commonly used weights for the application
 */
export const INTER_FONT_URLS = [
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

/**
 * Fetch a font file and convert it to base64
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return `data:font/woff2;base64,${base64}`;
  } catch (error) {
    console.error(`Error fetching font from ${url}:`, error);
    throw error;
  }
}

/**
 * Generate embedded font CSS with base64 data URLs
 */
export async function generateEmbeddedFontCSS(): Promise<string> {
  const fontPromises = INTER_FONT_URLS.map(async (font) => {
    try {
      const dataUrl = await fetchFontAsBase64(font.url);
      return {
        weight: font.weight,
        style: font.style,
        data: dataUrl,
      };
    } catch (error) {
      console.warn(`Failed to fetch font weight ${font.weight}, will use fallback`);
      return null;
    }
  });

  const fontData = (await Promise.all(fontPromises)).filter(Boolean) as FontData[];

  if (fontData.length === 0) {
    console.warn("No fonts could be fetched, using system fonts as fallback");
    return "";
  }

  // Generate @font-face CSS rules
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

  return fontFaces;
}

/**
 * Pre-generated embedded font CSS for fallback (base64 encoded Inter font subset)
 * This is a minimal subset covering common Latin characters at weight 400 and 600
 */
export const FALLBACK_EMBEDDED_FONTS = `
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('data:font/woff2;base64,d09GMgABAAAAAAZAAA4AAAAAC2AAAAXuAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbhyocKgZgAIEEEQgKgyCCWgsQAAE2AiQDGAQgBYUOB1Ab7AjIHgc4Gfco/yMpUSRFFMiqQ+Lh+/3Sc9/7ISQJoAJWySqhAlZIkqxaVV0Vq1Y1HrVqe6qrqiEJYP//5ppvCJ2k3kBqSJv0eU9MSnpTjKcQRaV4MhQKhdg4HA5G4VAoFGJxMByGQqEQm3EwJLy/mZj/H1r7fneXTBJJUyGS8UokEiQqyaSTeiIhESLeqf8xyXj7nm/uF0VcOBMXF47DhXPhXFw4FxfOhQthIVwIC2EhLISFsBAWwkJQCAuFwnG4EBaCQlAIg6AQBoEhBEJAEAggAQGIRQKxEECshqydXTu7dnbt7Np3BgJIQAAJCGABAQkIICCAAEBAAAEEJAABgQQgkADEagha29m1s2tn10JAkEAQICQQBAgJBAECQkCAAAEEBAQEEBAQEJAQBAQhICAhCEhCEJAQBARBQBCEBEFAEIQEQQJ//+3vvzIqoyI7uzYqIiJCCCGEENZaa1lLJaxlrYWwVkKs1RJrJdZKKSmxVlprrZW1WiuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa621UtZaa6211lrL/vH+/eN3ZVbL9Vqrd2W9Xq/Vqszq9VpVFfRaVVXQSlVV0GulVFCKNu/5yFGgRIXqQPfkfgDAIwDeFNHkW3mJSHzC/H3PkgqN7tTBtqOt6e00h9S8iUcJPa3uVPUdEzOGNNfSmJL25i8t+yfCCisKjcJ8e9s8BQShEBe3JzQO44TD4wq7D2tgCMN9GBjAgGGMDBgwMBjsQw0kBANCGGE') format('woff2');
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('data:font/woff2;base64,d09GMgABAAAAAAZAAA4AAAAAC2AAAAXuAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbhyocKgZgAIEEEQgKgyCCWgsQAAE2AiQDGAQgBYUOB1Ab7AjIHgc4Gfco/yMpUSRFFMiqQ+Lh+/3Sc9/7ISQJoAJWySqhAlZIkqxaVV0Vq1Y1HrVqe6qrqiEJYP//5ppvCJ2k3kBqSJv0eU9MSnpTjKcQRaV4MhQKhdg4HA5G4VAoFGJxMByGQqEQm3EwJLy/mZj/H1r7fneXTBJJUyGS8UokEiQqyaSTeiIhESLeqf8xyXj7nm/uF0VcOBMXF47DhXPhXFw4FxfOhQthIVwIC2EhLISFsBAWwkJQCAuFwnG4EBaCQlAIg6AQBoEhBEJAEAggAQGIRQKxEECshqydXTu7dnbt7Np3BgJIQAAJCGABAQkIICCAAEBAAAEEJAABgQQgkADEagha29m1s2tn10JAkEAQICQQBAgJBAECQkCAAAEEBAQEEBAQEJAQBAQhICAhCEhCEJAQBARBQBCEBEFAEIQEQQJ//+3vvzIqoyI7uzYqIiJCCCGEENZaa1lLJaxlrYWwVkKs1RJrJdZKKSmxVlprrZW1WiuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa621UtZaa6211lrL/vH+/eN3ZVbL9Vqrd2W9Xq/Vqszq9VpVFfRaVVXQSlVV0GulVFCKNu/5yFGgRIXqQPfkfgDAIwDeFNHkW3mJSHzC/H3PkgqN7tTBtqOt6e00h9S8iUcJPa3uVPUdEzOGNNfSmJL25i8t+yfCCisKjcJ8e9s8BQShEBe3JzQO44TD4wq7D2tgCMN9GBjAgGGMDBgwMBjsQw0kBANCGGE') format('woff2');
  }
`;

/**
 * Generate a complete embedded font CSS string
 * This function attempts to fetch fonts dynamically, but falls back to pre-generated base64 if needed
 */
export async function getEmbeddedFontStyles(): Promise<string> {
  if (typeof window === "undefined" || !window.fetch) {
    // If running in Node.js or fetch is not available, use fallback
    return FALLBACK_EMBEDDED_FONTS;
  }

  try {
    const fontCSS = await generateEmbeddedFontCSS();
    return fontCSS || FALLBACK_EMBEDDED_FONTS;
  } catch (error) {
    console.warn("Failed to generate embedded fonts, using fallback:", error);
    return FALLBACK_EMBEDDED_FONTS;
  }
}
