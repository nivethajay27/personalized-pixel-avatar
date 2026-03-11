import type { AvatarConfig } from "@pixel/shared-types";

const TRANSPARENT = [0, 0, 0, 0] as const;

const skinPalette = {
  light: "#f5d2b3",
  tan: "#d9a273",
  deep: "#7b4a2c",
  alien: "#86efac"
} as const;

const hairPalette = {
  none: "#00000000",
  short: "#312e81",
  mohawk: "#f97316",
  buns: "#be123c",
  curly: "#16a34a",
  long: "#0ea5e9",
  pixie: "#7c3aed",
  ponytail: "#f59e0b"
} as const;

const eyePalette = {
  classic: "#111827",
  sleepy: "#334155",
  cyber: "#22d3ee",
  happy: "#f97316",
  angry: "#ef4444",
  stars: "#facc15",
  wink: "#38bdf8"
} as const;

const backgroundPalette = {
  sky: ["#7dd3fc", "#38bdf8"],
  sunset: ["#fb7185", "#f97316"],
  mint: ["#5eead4", "#22d3ee"],
  void: ["#0f172a", "#1e293b"],
  aurora: ["#34d399", "#60a5fa"],
  peach: ["#fdba74", "#fda4af"],
  storm: ["#94a3b8", "#475569"],
  neon: ["#22d3ee", "#a855f7"]
} as const;

const accessoryPalette = {
  none: "#00000000",
  glasses: "#0f172a",
  bandana: "#ec4899",
  earring: "#fde047",
  headset: "#22d3ee",
  mask: "#0ea5e9",
  cap: "#475569",
  crown: "#facc15",
  visor: "#67e8f980"
} as const;

function parseHex(color: string): [number, number, number, number] {
  if (color.startsWith("#") && color.length === 9) {
    return [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
      parseInt(color.slice(7, 9), 16)
    ];
  }
  return [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
    255
  ];
}

function paintPixel(buffer: Uint8ClampedArray, size: number, x: number, y: number, color: [number, number, number, number]): void {
  if (x < 0 || y < 0 || x >= size || y >= size || color[3] === 0) {
    return;
  }
  const index = (y * size + x) * 4;
  buffer[index] = color[0];
  buffer[index + 1] = color[1];
  buffer[index + 2] = color[2];
  buffer[index + 3] = color[3];
}

function fillRect(
  buffer: Uint8ClampedArray,
  size: number,
  x0: number,
  y0: number,
  width: number,
  height: number,
  color: [number, number, number, number]
): void {
  for (let y = y0; y < y0 + height; y += 1) {
    for (let x = x0; x < x0 + width; x += 1) {
      paintPixel(buffer, size, x, y, color);
    }
  }
}

function drawBackground(buffer: Uint8ClampedArray, size: number, background: AvatarConfig["background"]): void {
  const [topHex, bottomHex] = backgroundPalette[background];
  const top = parseHex(topHex);
  const bottom = parseHex(bottomHex);

  for (let y = 0; y < size; y += 1) {
    const t = y / Math.max(1, size - 1);
    const row: [number, number, number, number] = [
      Math.round(top[0] * (1 - t) + bottom[0] * t),
      Math.round(top[1] * (1 - t) + bottom[1] * t),
      Math.round(top[2] * (1 - t) + bottom[2] * t),
      255
    ];

    for (let x = 0; x < size; x += 1) {
      paintPixel(buffer, size, x, y, row);
    }
  }

  for (let i = 0; i < size; i += 2) {
    paintPixel(buffer, size, i, Math.floor(size * 0.25), [255, 255, 255, 80]);
  }
}

function drawHead(buffer: Uint8ClampedArray, size: number, skin: AvatarConfig["skin"]): void {
  const skinColor = parseHex(skinPalette[skin]);
  const shade: [number, number, number, number] = [
    Math.max(0, skinColor[0] - 20),
    Math.max(0, skinColor[1] - 20),
    Math.max(0, skinColor[2] - 20),
    255
  ];

  fillRect(buffer, size, 4, 4, 8, 8, skinColor);
  fillRect(buffer, size, 5, 12, 6, 3, skinColor);

  for (let x = 4; x <= 11; x += 1) {
    paintPixel(buffer, size, x, 11, shade);
  }
}

function drawHair(buffer: Uint8ClampedArray, size: number, hair: AvatarConfig["hair"]): void {
  const hairHex = hairPalette[hair];
  if (hairHex === "#00000000") {
    return;
  }

  const color = parseHex(hairHex);
  if (hair === "short") {
    fillRect(buffer, size, 4, 3, 8, 2, color);
    fillRect(buffer, size, 3, 4, 1, 4, color);
    fillRect(buffer, size, 12, 4, 1, 4, color);
  }

  if (hair === "mohawk") {
    fillRect(buffer, size, 7, 1, 2, 5, color);
  }

  if (hair === "buns") {
    fillRect(buffer, size, 4, 3, 8, 2, color);
    fillRect(buffer, size, 2, 2, 2, 2, color);
    fillRect(buffer, size, 12, 2, 2, 2, color);
  }

  if (hair === "curly") {
    fillRect(buffer, size, 3, 3, 10, 2, color);
    fillRect(buffer, size, 2, 4, 2, 3, color);
    fillRect(buffer, size, 12, 4, 2, 3, color);
    fillRect(buffer, size, 4, 5, 8, 1, color);
  }

  if (hair === "long") {
    fillRect(buffer, size, 4, 3, 8, 2, color);
    fillRect(buffer, size, 3, 4, 1, 8, color);
    fillRect(buffer, size, 12, 4, 1, 8, color);
    fillRect(buffer, size, 4, 11, 8, 2, color);
  }

  if (hair === "pixie") {
    fillRect(buffer, size, 5, 3, 6, 1, color);
    fillRect(buffer, size, 4, 4, 8, 1, color);
    fillRect(buffer, size, 4, 5, 2, 1, color);
    fillRect(buffer, size, 10, 5, 2, 1, color);
  }

  if (hair === "ponytail") {
    fillRect(buffer, size, 4, 3, 8, 2, color);
    fillRect(buffer, size, 3, 4, 1, 3, color);
    fillRect(buffer, size, 12, 4, 1, 3, color);
    fillRect(buffer, size, 12, 6, 2, 4, color);
    paintPixel(buffer, size, 11, 7, color);
  }
}

function drawEyes(buffer: Uint8ClampedArray, size: number, eyes: AvatarConfig["eyes"]): void {
  const color = parseHex(eyePalette[eyes]);

  if (eyes === "sleepy") {
    fillRect(buffer, size, 5, 7, 2, 1, color);
    fillRect(buffer, size, 9, 7, 2, 1, color);
    return;
  }

  fillRect(buffer, size, 5, 7, 2, 2, color);
  fillRect(buffer, size, 9, 7, 2, 2, color);

  if (eyes === "cyber") {
    paintPixel(buffer, size, 5, 8, [255, 255, 255, 220]);
    paintPixel(buffer, size, 9, 8, [255, 255, 255, 220]);
  }

  if (eyes === "happy") {
    paintPixel(buffer, size, 5, 7, color);
    paintPixel(buffer, size, 6, 8, color);
    paintPixel(buffer, size, 9, 7, color);
    paintPixel(buffer, size, 10, 8, color);
  }

  if (eyes === "angry") {
    fillRect(buffer, size, 5, 7, 2, 1, color);
    fillRect(buffer, size, 9, 7, 2, 1, color);
    paintPixel(buffer, size, 4, 6, color);
    paintPixel(buffer, size, 10, 6, color);
  }

  if (eyes === "stars") {
    fillRect(buffer, size, 5, 7, 2, 2, color);
    fillRect(buffer, size, 9, 7, 2, 2, color);
    paintPixel(buffer, size, 6, 8, [255, 255, 255, 220]);
    paintPixel(buffer, size, 10, 8, [255, 255, 255, 220]);
  }

  if (eyes === "wink") {
    fillRect(buffer, size, 5, 7, 2, 1, color);
    fillRect(buffer, size, 9, 7, 2, 2, color);
  }
}

function drawMouth(buffer: Uint8ClampedArray, size: number): void {
  fillRect(buffer, size, 7, 10, 2, 1, [55, 25, 25, 255]);
}

function drawAccessory(buffer: Uint8ClampedArray, size: number, accessory: AvatarConfig["accessory"]): void {
  const color = parseHex(accessoryPalette[accessory]);

  if (accessory === "glasses") {
    fillRect(buffer, size, 4, 7, 3, 2, color);
    fillRect(buffer, size, 9, 7, 3, 2, color);
    fillRect(buffer, size, 7, 7, 2, 1, color);
  }

  if (accessory === "bandana") {
    fillRect(buffer, size, 4, 5, 8, 2, color);
    paintPixel(buffer, size, 12, 6, color);
    paintPixel(buffer, size, 13, 7, color);
  }

  if (accessory === "earring") {
    paintPixel(buffer, size, 11, 11, color);
    paintPixel(buffer, size, 11, 12, color);
  }

  if (accessory === "headset") {
    fillRect(buffer, size, 3, 7, 1, 3, color);
    fillRect(buffer, size, 12, 7, 1, 3, color);
    fillRect(buffer, size, 5, 4, 6, 1, color);
  }

  if (accessory === "mask") {
    fillRect(buffer, size, 5, 9, 6, 3, color);
    paintPixel(buffer, size, 3, 10, color);
    paintPixel(buffer, size, 12, 10, color);
  }

  if (accessory === "cap") {
    fillRect(buffer, size, 4, 2, 8, 2, color);
    fillRect(buffer, size, 3, 4, 10, 1, color);
  }

  if (accessory === "crown") {
    paintPixel(buffer, size, 5, 2, color);
    paintPixel(buffer, size, 7, 1, color);
    paintPixel(buffer, size, 9, 2, color);
    fillRect(buffer, size, 4, 3, 8, 1, color);
  }

  if (accessory === "visor") {
    fillRect(buffer, size, 4, 7, 8, 2, color);
  }
}

export function renderAvatarPixels(config: AvatarConfig, size = 16): Uint8ClampedArray {
  const buffer = new Uint8ClampedArray(size * size * 4);
  drawBackground(buffer, size, config.background);
  drawHead(buffer, size, config.skin);
  drawHair(buffer, size, config.hair);
  drawEyes(buffer, size, config.eyes);
  drawMouth(buffer, size);
  drawAccessory(buffer, size, config.accessory);

  for (let y = 0; y < size; y += 1) {
    paintPixel(buffer, size, 3, y, TRANSPARENT);
    paintPixel(buffer, size, size - 4, y, TRANSPARENT);
  }

  return buffer;
}
