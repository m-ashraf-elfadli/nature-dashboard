// Keep in sync with nature/src/app/features/our-company/utils/company-palette.util.ts
// (the dashboard previews exactly what the website will render).
/**
 * Derives the three company colors (overview background, leaf, bold line)
 * from the single "Card Background Color" picked in the dashboard.
 *
 * Calibrated against the colors the site used before this was dynamic:
 *   company   leaf      line*     background
 *   Khalilco  #C2A04E   #C1A04E   #F2EBDB
 *   Nature    #95C45C   #8EC559   #E6F2DE
 *   NCSR      #3FC6C3   #35BFBE   #F0FAFA
 *   (* average color of the brush image)
 * In each row the hue and saturation are the same; only lightness changes
 * (leaf ~53%, line ~2-3% darker and slightly more saturated, background ~93%).
 * So we keep the picked hue and saturation and derive the other colors by lightness:
 *  - a vivid pick (lightness <= 75%) IS the leaf color; line and background are derived;
 *  - a pale pick IS the background color; leaf and line are derived.
 * Either way, entering a company's current leaf or background color reproduces it exactly.
 */
export interface CompanyPalette {
  background: string;
  leaf: string;
  line: string;
}

const LEAF_LIGHTNESS = 0.54;
const LINE_DARKEN = 0.03;
const LINE_SATURATION_BOOST = 0.03;
const BACKGROUND_LIGHTNESS = 0.93;
const BACKGROUND_SATURATION_RATIO = 0.93;
const PALE_THRESHOLD = 0.75;

/** Fallback (Nature green) when the color is missing or invalid. */
export const DEFAULT_COMPANY_COLOR = '#95C45C';

export function deriveCompanyPalette(hex?: string | null): CompanyPalette {
  const rgb = hexToRgb(hex) ?? hexToRgb(DEFAULT_COMPANY_COLOR)!;
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const picked = hslToHex(h, s, l);

  if (l > PALE_THRESHOLD) {
    const leafSaturation = clamp(s / BACKGROUND_SATURATION_RATIO);
    return {
      background: picked,
      leaf: hslToHex(h, leafSaturation, LEAF_LIGHTNESS),
      line: hslToHex(h, lineSaturation(leafSaturation), LEAF_LIGHTNESS - LINE_DARKEN),
    };
  }

  return {
    leaf: picked,
    line: hslToHex(h, lineSaturation(s), clamp(l - LINE_DARKEN)),
    background: hslToHex(h, s * BACKGROUND_SATURATION_RATIO, BACKGROUND_LIGHTNESS),
  };
}

export function isValidHexColor(value?: string | null): boolean {
  return !!hexToRgb(value);
}

function hexToRgb(hex?: string | null): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let value = hex.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(value)) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  const num = parseInt(value, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s: clamp(s), l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Greys stay grey: only boost saturation for actual colors. */
function lineSaturation(s: number): number {
  return s < 0.05 ? s : clamp(s + LINE_SATURATION_BOOST);
}
