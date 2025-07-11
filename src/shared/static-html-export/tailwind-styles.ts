export const tailwindExportStyles = `/* Tailwind CSS v3.x - Compiled styles for static export */

/* CSS Variables and Reset */
*,
::before,
::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

/* Base styles */
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
  font-feature-settings: normal;
  font-variation-settings: normal;
  -webkit-tap-highlight-color: transparent;
}

body {
  margin: 0;
  line-height: inherit;
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: inherit;
}

b, strong {
  font-weight: bolder;
}

code, kbd, samp, pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-size: 1em;
}

small {
  font-size: 80%;
}

sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}

button, input, optgroup, select, textarea {
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}

button, select {
  text-transform: none;
}

button, [role="button"] {
  cursor: pointer;
}

:disabled {
  cursor: default;
}

img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}

img, video {
  max-width: 100%;
  height: auto;
}

blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol, ul, menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

textarea {
  resize: vertical;
}

input::placeholder, textarea::placeholder {
  opacity: 1;
  color: #9ca3af;
}

/* Custom app styles */
html, body {
  background: linear-gradient(to bottom right, #0f172a, #1e293b 80%) !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

html, body {
  scrollbar-width: thin;
  scrollbar-color: #334155 #0f172a;
}

html::-webkit-scrollbar, body::-webkit-scrollbar {
  width: 12px;
  background: #0f172a;
}

html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #334155 40%, #1e293b 100%);
  border-radius: 8px;
  border: 2px solid #0f172a;
  min-height: 40px;
}

html::-webkit-scrollbar-thumb:hover, body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #475569 40%, #334155 100%);
}

html::-webkit-scrollbar-corner, body::-webkit-scrollbar-corner {
  background: #0f172a;
}

/* Layout utilities */
.container { width: 100%; }
.static { position: static; }
.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }
.sticky { position: sticky; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-0 { top: 0; }
.top-1\\/2 { top: 50%; }
.top-full { top: 100%; }
.bottom-0 { bottom: 0; }
.bottom-full { bottom: 100%; }
.left-0 { left: 0; }
.left-1\\/2 { left: 50%; }
.left-3 { left: 0.75rem; }
.right-0 { right: 0; }
.right-3 { right: 0.75rem; }
.z-10 { z-index: 10; }
.z-50 { z-index: 50; }

/* Flexbox & Grid */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }

.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Vertical alignment */
.align-baseline { vertical-align: baseline; }
.align-top { vertical-align: top; }
.align-middle { vertical-align: middle; }
.align-bottom { vertical-align: bottom; }
.align-text-top { vertical-align: text-top; }
.align-text-bottom { vertical-align: text-bottom; }

.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

/* Spacing */
.m-0 { margin: 0; }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.mt-0 { margin-top: 0; }
.mt-0\\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.ml-1 { margin-left: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }

/* Negative margins for fine-tuning alignment */
.-mt-0 { margin-top: 0; }
.-mt-0\.5 { margin-top: -0.125rem; }
.-mt-1 { margin-top: -0.25rem; }

.space-x-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(0.5rem * var(--tw-space-x-reverse)); margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse))); }
.space-x-3 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(0.75rem * var(--tw-space-x-reverse)); margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse))); }
.space-x-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(1rem * var(--tw-space-x-reverse)); margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse))); }
.space-y-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.25rem * var(--tw-space-y-reverse)); }
.space-y-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.5rem * var(--tw-space-y-reverse)); }
.divide-x > :not([hidden]) ~ :not([hidden]) { --tw-divide-x-reverse: 0; border-right-width: calc(1px * var(--tw-divide-x-reverse)); border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse))); }
.divide-slate-600\\/50 > :not([hidden]) ~ :not([hidden]) { border-color: rgb(71 85 105 / 0.5); }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1rem * var(--tw-space-y-reverse)); }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(1.5rem * var(--tw-space-y-reverse)); }
.space-y-8 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(2rem * var(--tw-space-y-reverse)); }

/* Sizing */
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-12 { height: 3rem; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

.w-3 { width: 0.75rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-12 { width: 3rem; }
.w-full { width: 100%; }
.min-w-0 { min-width: 0; }
.max-w-7xl { max-width: 80rem; }
.max-w-xs { max-width: 20rem; }

.flex-1 { flex: 1 1 0%; }
.flex-shrink-0 { flex-shrink: 0; }

/* Transform */
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.-translate-x-1\\/2 { --tw-translate-x: -50%; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.-translate-y-1\\/2 { --tw-translate-y: -50%; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.rotate-180 { --tw-rotate: 180deg; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }

/* Interactivity */
.cursor-pointer { cursor: pointer; }
.select-none { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
.appearance-none { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
.pointer-events-none { pointer-events: none; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-x-auto { overflow-x: auto; }
.scroll-smooth { scroll-behavior: smooth; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Borders */
.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-4 { border-width: 4px; }
.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }

.border-transparent { border-color: transparent; }
.border-slate-600 { --tw-border-opacity: 1; border-color: rgb(71 85 105 / var(--tw-border-opacity)); }
.border-slate-700 { --tw-border-opacity: 1; border-color: rgb(51 65 85 / var(--tw-border-opacity)); }
.border-red-600 { --tw-border-opacity: 1; border-color: rgb(220 38 38 / var(--tw-border-opacity)); }
.border-red-700 { --tw-border-opacity: 1; border-color: rgb(185 28 28 / var(--tw-border-opacity)); }
.border-orange-700 { --tw-border-opacity: 1; border-color: rgb(194 65 12 / var(--tw-border-opacity)); }
.border-amber-700 { --tw-border-opacity: 1; border-color: rgb(180 83 9 / var(--tw-border-opacity)); }
.border-amber-500 { --tw-border-opacity: 1; border-color: rgb(245 158 11 / var(--tw-border-opacity)); }
.border-blue-700 { --tw-border-opacity: 1; border-color: rgb(29 78 216 / var(--tw-border-opacity)); }
.border-blue-500 { --tw-border-opacity: 1; border-color: rgb(59 130 246 / var(--tw-border-opacity)); }
.border-purple-700 { --tw-border-opacity: 1; border-color: rgb(126 34 206 / var(--tw-border-opacity)); }
.border-purple-500 { --tw-border-opacity: 1; border-color: rgb(168 85 247 / var(--tw-border-opacity)); }
.border-slate-600\\/30 { border-color: rgb(71 85 105 / 0.3); }

/* Border opacity */
.border-opacity-50 { --tw-border-opacity: 0.5; }
.border-opacity-70 { --tw-border-opacity: 0.7; }

/* Backgrounds */
.bg-transparent { background-color: transparent; }
.bg-slate-500 { --tw-bg-opacity: 1; background-color: rgb(100 116 139 / var(--tw-bg-opacity)); }
.bg-slate-700 { --tw-bg-opacity: 1; background-color: rgb(51 65 85 / var(--tw-bg-opacity)); }
.bg-slate-700\\/50 { background-color: rgb(51 65 85 / 0.5); }
.bg-slate-600\\/50 { background-color: rgb(71 85 105 / 0.5); }
.bg-slate-800 { --tw-bg-opacity: 1; background-color: rgb(30 41 59 / var(--tw-bg-opacity)); }
.bg-slate-800\\/50 { background-color: rgb(30 41 59 / 0.5); }
.bg-slate-800\\/70 { background-color: rgb(30 41 59 / 0.7); }
.bg-slate-900 { --tw-bg-opacity: 1; background-color: rgb(15 23 42 / var(--tw-bg-opacity)); }
.bg-slate-900\\/80 { background-color: rgb(15 23 42 / 0.8); }

.bg-red-500 { --tw-bg-opacity: 1; background-color: rgb(239 68 68 / var(--tw-bg-opacity)); }
.bg-red-900\\/20 { background-color: rgb(127 29 29 / 0.2); }
.bg-red-900\\/40 { background-color: rgb(127 29 29 / 0.4); }
.bg-red-900\\/90 { background-color: rgb(127 29 29 / 0.9); }

.bg-orange-500 { --tw-bg-opacity: 1; background-color: rgb(249 115 22 / var(--tw-bg-opacity)); }
.bg-orange-900\\/20 { background-color: rgb(124 45 18 / 0.2); }
.bg-orange-900\\/40 { background-color: rgb(124 45 18 / 0.4); }

.bg-amber-500 { --tw-bg-opacity: 1; background-color: rgb(245 158 11 / var(--tw-bg-opacity)); }
.bg-amber-900\\/20 { background-color: rgb(120 53 15 / 0.2); }
.bg-amber-900\\/40 { background-color: rgb(120 53 15 / 0.4); }

.bg-blue-500 { --tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity)); }
.bg-blue-600 { --tw-bg-opacity: 1; background-color: rgb(37 99 235 / var(--tw-bg-opacity)); }
.bg-blue-900\\/20 { background-color: rgb(30 58 138 / 0.2); }
.bg-blue-900\\/40 { background-color: rgb(30 58 138 / 0.4); }

.bg-purple-900\\/20 { background-color: rgb(88 28 135 / 0.2); }

/* Padding */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.first\\:pl-0:first-child { padding-left: 0px; }
.last\\:pr-0:last-child { padding-right: 0px; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-4 { padding-top: 1rem; }
.pt-6 { padding-top: 1.5rem; }
.pl-2 { padding-left: 0.5rem; }
.pl-10 { padding-left: 2.5rem; }
.pr-4 { padding-right: 1rem; }
.pr-8 { padding-right: 2rem; }

/* Typography */
.font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.uppercase { text-transform: uppercase; }
.tracking-wider { letter-spacing: 0.05em; }
.leading-relaxed { line-height: 1.625; }
.text-left { text-align: left; }
.text-center { text-align: center; }

/* Text colors */
.text-white { --tw-text-opacity: 1; color: rgb(255 255 255 / var(--tw-text-opacity)); }
.text-slate-100 { --tw-text-opacity: 1; color: rgb(241 245 249 / var(--tw-text-opacity)); }
.text-slate-200 { --tw-text-opacity: 1; color: rgb(226 232 240 / var(--tw-text-opacity)); }
.text-slate-300 { --tw-text-opacity: 1; color: rgb(203 213 225 / var(--tw-text-opacity)); }
.text-slate-400 { --tw-text-opacity: 1; color: rgb(148 163 184 / var(--tw-text-opacity)); }
.text-slate-500 { --tw-text-opacity: 1; color: rgb(100 116 139 / var(--tw-text-opacity)); }
.text-slate-600 { --tw-text-opacity: 1; color: rgb(71 85 105 / var(--tw-text-opacity)); }
.text-red-200 { --tw-text-opacity: 1; color: rgb(254 202 202 / var(--tw-text-opacity)); }
.text-red-300 { --tw-text-opacity: 1; color: rgb(252 165 165 / var(--tw-text-opacity)); }
.text-red-400 { --tw-text-opacity: 1; color: rgb(248 113 113 / var(--tw-text-opacity)); }
.text-orange-300 { --tw-text-opacity: 1; color: rgb(253 186 116 / var(--tw-text-opacity)); }
.text-orange-400 { --tw-text-opacity: 1; color: rgb(251 146 60 / var(--tw-text-opacity)); }
.text-amber-300 { --tw-text-opacity: 1; color: rgb(252 211 77 / var(--tw-text-opacity)); }
.text-amber-400 { --tw-text-opacity: 1; color: rgb(251 191 36 / var(--tw-text-opacity)); }
.text-blue-300 { --tw-text-opacity: 1; color: rgb(147 197 253 / var(--tw-text-opacity)); }
.text-blue-400 { --tw-text-opacity: 1; color: rgb(96 165 250 / var(--tw-text-opacity)); }
.text-purple-400 { --tw-text-opacity: 1; color: rgb(192 132 252 / var(--tw-text-opacity)); }
.text-green-400 { --tw-text-opacity: 1; color: rgb(74 222 128 / var(--tw-text-opacity)); }

/* Effects */
.shadow { --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
.shadow-lg { --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.5; }
.backdrop-blur-sm { --tw-backdrop-blur: blur(4px); backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia); }
.backdrop-blur-xl { --tw-backdrop-blur: blur(24px); backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia); }
.antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

/* Transitions */
.transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.7s ease-out;
}

.animate-fade-in[style*="animation-delay"] {
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover states */
.hover\\:scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.hover\\:scale-\\[1\\.01\\]:hover {
  --tw-scale-x: 1.01;
  --tw-scale-y: 1.01;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.hover\\:bg-slate-500\\/50:hover { background-color: rgb(100 116 139 / 0.5); }
.hover\\:bg-slate-600\\/50:hover { background-color: rgb(71 85 105 / 0.5); }
.hover\\:bg-slate-700\\/90:hover { background-color: rgb(51 65 85 / 0.9); }
.hover\\:text-black:hover { --tw-text-opacity: 1; color: rgb(0 0 0 / var(--tw-text-opacity)); }
.hover\\:text-white:hover { --tw-text-opacity: 1; color: rgb(255 255 255 / var(--tw-text-opacity)); }
.hover\\:text-blue-300:hover { --tw-text-opacity: 1; color: rgb(147 197 253 / var(--tw-text-opacity)); }
.hover\\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* Focus states */
.focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-blue-500:focus { --tw-ring-opacity: 1; --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity)); }
.focus\\:border-blue-500:focus { --tw-border-opacity: 1; border-color: rgb(59 130 246 / var(--tw-border-opacity)); }

/* Hover border opacity */
.hover\\:border-opacity-70:hover { --tw-border-opacity: 0.7; }

/* Active states */
.active\\:scale-95:active {
  --tw-scale-x: 0.95;
  --tw-scale-y: 0.95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

/* Group states */
.group:hover .group-hover\\:opacity-100 { opacity: 1; }

/* Responsive Design */
@media (min-width: 640px) {
  .sm\\:flex { display: flex; }
  .sm\\:hidden { display: none; }
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:flex-initial { flex: 0 1 auto; }
  .sm\\:items-center { align-items: center; }
  .sm\\:justify-between { justify-content: space-between; }
  .sm\\:justify-start { justify-content: flex-start; }
  .sm\\:gap-0 { gap: 0px; }
  .sm\\:gap-2 { gap: 0.5rem; }
  .sm\\:gap-4 { gap: 1rem; }
  .sm\\:space-x-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.75rem * var(--tw-space-x-reverse));
    margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .sm\\:space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .sm\\:space-x-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1.5rem * var(--tw-space-x-reverse));
    margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .sm\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
  }
  .sm\\:space-y-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(2rem * var(--tw-space-y-reverse));
  }
  .sm\\:p-4 { padding: 1rem; }
  .sm\\:p-6 { padding: 1.5rem; }
  .sm\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .sm\\:px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .sm\\:py-0 { padding-top: 0; padding-bottom: 0; }
  .sm\\:py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .sm\\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .sm\\:pt-6 { padding-top: 1.5rem; }
  .sm\\:mb-3 { margin-bottom: 0.75rem; }
  .sm\\:mb-4 { margin-bottom: 1rem; }
  .sm\\:mb-6 { margin-bottom: 1.5rem; }
  .sm\\:mt-4 { margin-top: 1rem; }
  .sm\\:mt-6 { margin-top: 1.5rem; }
  .sm\\:left-3 { left: 0.75rem; }
  .sm\\:right-3 { right: 0.75rem; }
  .sm\\:h-5 { height: 1.25rem; }
  .sm\\:h-6 { height: 1.5rem; }
  .sm\\:w-5 { width: 1.25rem; }
  .sm\\:w-6 { width: 1.5rem; }
  .sm\\:w-auto { width: auto; }
  .sm\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .sm\\:text-base { font-size: 1rem; line-height: 1.5rem; }
  .sm\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 640px) {
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:items-center { align-items: center; }
  .sm\\:justify-between { justify-content: space-between; }
  .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
}

@media (min-width: 1024px) {
  .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

/* Custom components */
.chevron {
  transition: transform 0.2s ease;
}

.expanded .chevron {
  transform: rotate(180deg);
}

/* Additional utility classes */
.border-2 { border-width: 2px; }
.border-4 { border-width: 4px; }
.select-none { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
.whitespace-pre-wrap { white-space: pre-wrap; }
.break-all { word-break: break-all; }
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
`;
