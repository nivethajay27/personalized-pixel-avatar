import type { AvatarConfig } from "@pixel/shared-types";

const TRANSPARENT: [number, number, number, number] = [0, 0, 0, 0];

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

const clothingPalette = {
  tee: "#38bdf8",
  hoodie: "#a855f7",
  jacket: "#f97316",
  armor: "#94a3b8"
} as const;

const hatPalette = {
  beanie: "#0ea5e9",
  cap: "#475569",
  crown: "#facc15"
} as const;

const accessoryPalette = {
  none: "#00000000",
  glasses: "#0f172a",
  bandana: "#ec4899",
  earring: "#fde047",
  headset: "#22d3ee",
  mask: "#0ea5e9",
  visor: "#67e8f980"
} as const;

function parseHex(color: string): [number, number, number, number] {
  if (color.startsWith("#") && color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return [
      parseInt(`${r}${r}`, 16),
      parseInt(`${g}${g}`, 16),
      parseInt(`${b}${b}`, 16),
      255
    ];
  }
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

function blendPixel(buffer: Uint8ClampedArray, size: number, x: number, y: number, color: [number, number, number, number]): void {
  if (x < 0 || y < 0 || x >= size || y >= size || color[3] === 0) {
    return;
  }
  const index = (y * size + x) * 4;
  const srcA = color[3] / 255;
  const dstA = buffer[index + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) {
    return;
  }
  buffer[index] = Math.round((color[0] * srcA + buffer[index] * dstA * (1 - srcA)) / outA);
  buffer[index + 1] = Math.round((color[1] * srcA + buffer[index + 1] * dstA * (1 - srcA)) / outA);
  buffer[index + 2] = Math.round((color[2] * srcA + buffer[index + 2] * dstA * (1 - srcA)) / outA);
  buffer[index + 3] = Math.round(outA * 255);
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

function drawBackground(
  buffer: Uint8ClampedArray,
  size: number,
  background: AvatarConfig["background"],
  pattern: AvatarConfig["backgroundPattern"],
  angle: number
): void {
  const [topHex, bottomHex] = backgroundPalette[background];
  const top = parseHex(topHex);
  const bottom = parseHex(bottomHex);
  const radians = (angle * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = size > 1 ? x / (size - 1) : 0.5;
      const ny = size > 1 ? y / (size - 1) : 0.5;
      const t = Math.min(1, Math.max(0, (nx - 0.5) * dx + (ny - 0.5) * dy + 0.5));
      const color: [number, number, number, number] = [
        Math.round(top[0] * (1 - t) + bottom[0] * t),
        Math.round(top[1] * (1 - t) + bottom[1] * t),
        Math.round(top[2] * (1 - t) + bottom[2] * t),
        255
      ];
      paintPixel(buffer, size, x, y, color);
    }
  }

  for (let i = 0; i < size; i += 2) {
    paintPixel(buffer, size, i, Math.floor(size * 0.25), [255, 255, 255, 80]);
  }

  if (pattern === "stripes") {
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 1) {
        blendPixel(buffer, size, x, y, [255, 255, 255, 28]);
      }
    }
  }

  if (pattern === "dots") {
    for (let y = 1; y < size; y += 3) {
      for (let x = 1; x < size; x += 3) {
        blendPixel(buffer, size, x, y, [255, 255, 255, 45]);
      }
    }
  }

  if (pattern === "checker") {
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        if ((x + y) % 4 === 0) {
          blendPixel(buffer, size, x, y, [255, 255, 255, 30]);
          blendPixel(buffer, size, x + 1, y, [255, 255, 255, 30]);
          blendPixel(buffer, size, x, y + 1, [255, 255, 255, 30]);
          blendPixel(buffer, size, x + 1, y + 1, [255, 255, 255, 30]);
        }
      }
    }
  }
}

function drawHead(buffer: Uint8ClampedArray, size: number, skin: AvatarConfig["skin"], skinColorOverride?: string): void {
  const skinColor = parseHex(skinColorOverride ?? skinPalette[skin]);
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

function drawHair(buffer: Uint8ClampedArray, size: number, hair: AvatarConfig["hair"], hairColorOverride?: string): void {
  const hairHex = hairColorOverride ?? hairPalette[hair];
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

function drawEyes(buffer: Uint8ClampedArray, size: number, eyes: AvatarConfig["eyes"], eyeColorOverride?: string): void {
  const color = parseHex(eyeColorOverride ?? eyePalette[eyes]);

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

function drawMouth(buffer: Uint8ClampedArray, size: number, mouth: AvatarConfig["mouth"]): void {
  const lip: [number, number, number, number] = [120, 47, 47, 255];
  const bright: [number, number, number, number] = [255, 255, 255, 230];

  if (mouth === "neutral") {
    fillRect(buffer, size, 6, 10, 4, 1, lip);
    return;
  }

  if (mouth === "open") {
    fillRect(buffer, size, 6, 10, 4, 2, [60, 20, 20, 255]);
    fillRect(buffer, size, 6, 10, 4, 1, lip);
    return;
  }

  if (mouth === "smirk") {
    fillRect(buffer, size, 7, 10, 3, 1, lip);
    paintPixel(buffer, size, 10, 9, lip);
    return;
  }

  if (mouth === "teeth") {
    fillRect(buffer, size, 6, 10, 4, 1, bright);
    paintPixel(buffer, size, 6, 11, lip);
    paintPixel(buffer, size, 9, 11, lip);
    return;
  }

  fillRect(buffer, size, 7, 10, 2, 1, lip);
}

function drawEyebrows(
  buffer: Uint8ClampedArray,
  size: number,
  eyebrows: AvatarConfig["eyebrows"],
  hair: AvatarConfig["hair"],
  hairColorOverride?: string
): void {
  const fallback = hair === "none" ? "#64748b" : hairPalette[hair];
  const baseColor = parseHex(hairColorOverride ?? fallback);
  if (eyebrows === "soft") {
    fillRect(buffer, size, 5, 6, 2, 1, baseColor);
    fillRect(buffer, size, 9, 6, 2, 1, baseColor);
  }
  if (eyebrows === "straight") {
    fillRect(buffer, size, 4, 6, 3, 1, baseColor);
    fillRect(buffer, size, 9, 6, 3, 1, baseColor);
  }
  if (eyebrows === "arch") {
    paintPixel(buffer, size, 5, 5, baseColor);
    paintPixel(buffer, size, 6, 6, baseColor);
    paintPixel(buffer, size, 9, 6, baseColor);
    paintPixel(buffer, size, 10, 5, baseColor);
  }
  if (eyebrows === "fierce") {
    paintPixel(buffer, size, 4, 6, baseColor);
    paintPixel(buffer, size, 5, 5, baseColor);
    paintPixel(buffer, size, 10, 5, baseColor);
    paintPixel(buffer, size, 11, 6, baseColor);
  }
}

function drawFacialHair(
  buffer: Uint8ClampedArray,
  size: number,
  facialHair: AvatarConfig["facialHair"],
  hair: AvatarConfig["hair"],
  hairColorOverride?: string
): void {
  if (facialHair === "none") {
    return;
  }
  const fallback = hair === "none" ? "#475569" : hairPalette[hair];
  const color = parseHex(hairColorOverride ?? fallback);

  if (facialHair === "stubble") {
    for (let x = 6; x <= 9; x += 1) {
      paintPixel(buffer, size, x, 11, color);
    }
    return;
  }

  if (facialHair === "mustache") {
    fillRect(buffer, size, 6, 9, 4, 1, color);
    return;
  }

  if (facialHair === "goatee") {
    fillRect(buffer, size, 7, 11, 2, 2, color);
    paintPixel(buffer, size, 7, 10, color);
    paintPixel(buffer, size, 8, 10, color);
    return;
  }

  if (facialHair === "beard") {
    fillRect(buffer, size, 5, 9, 6, 4, color);
  }
}

function drawClothing(buffer: Uint8ClampedArray, size: number, clothing: AvatarConfig["clothing"]): void {
  const color = parseHex(clothingPalette[clothing]);
  fillRect(buffer, size, 4, 12, 8, 3, color);

  if (clothing === "hoodie") {
    paintPixel(buffer, size, 6, 12, [255, 255, 255, 120]);
    paintPixel(buffer, size, 9, 12, [255, 255, 255, 120]);
  }

  if (clothing === "jacket") {
    paintPixel(buffer, size, 7, 12, [255, 255, 255, 120]);
    paintPixel(buffer, size, 8, 12, [255, 255, 255, 120]);
  }

  if (clothing === "armor") {
    fillRect(buffer, size, 6, 12, 4, 1, [255, 255, 255, 120]);
    fillRect(buffer, size, 6, 14, 4, 1, [255, 255, 255, 120]);
  }
}

function drawHat(buffer: Uint8ClampedArray, size: number, hat: AvatarConfig["hat"]): void {
  if (hat === "none") {
    return;
  }
  const color = parseHex(hatPalette[hat]);

  if (hat === "beanie") {
    fillRect(buffer, size, 4, 2, 8, 2, color);
    fillRect(buffer, size, 5, 1, 6, 1, color);
  }

  if (hat === "cap") {
    fillRect(buffer, size, 4, 2, 8, 2, color);
    fillRect(buffer, size, 3, 4, 10, 1, color);
  }

  if (hat === "crown") {
    paintPixel(buffer, size, 5, 2, color);
    paintPixel(buffer, size, 7, 1, color);
    paintPixel(buffer, size, 9, 2, color);
    fillRect(buffer, size, 4, 3, 8, 1, color);
  }
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

  if (accessory === "visor") {
    fillRect(buffer, size, 4, 7, 8, 2, color);
  }
}

export function renderAvatarPixels(config: AvatarConfig, size = 16): Uint8ClampedArray {
  const buffer = new Uint8ClampedArray(size * size * 4);
  drawBackground(buffer, size, config.background, config.backgroundPattern, config.backgroundAngle);
  drawClothing(buffer, size, config.clothing);
  drawHead(buffer, size, config.skin, config.skinColor);
  drawHair(buffer, size, config.hair, config.hairColor);
  drawEyebrows(buffer, size, config.eyebrows, config.hair, config.hairColor);
  drawEyes(buffer, size, config.eyes, config.eyeColor);
  drawMouth(buffer, size, config.mouth);
  drawFacialHair(buffer, size, config.facialHair, config.hair, config.hairColor);
  drawHat(buffer, size, config.hat);
  drawAccessory(buffer, size, config.accessory);

  for (let y = 0; y < size; y += 1) {
    paintPixel(buffer, size, 3, y, TRANSPARENT);
    paintPixel(buffer, size, size - 4, y, TRANSPARENT);
  }

  return buffer;
}
