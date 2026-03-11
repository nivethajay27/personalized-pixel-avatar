import { PNG } from "pngjs";

export function pixelsToPngBuffer(pixels: Uint8ClampedArray, size: number, scale = 16): Buffer {
  const safeScale = Math.min(Math.max(scale, 4), 64);
  const width = size * safeScale;
  const height = size * safeScale;
  const png = new PNG({ width, height });

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const source = (y * size + x) * 4;
      const r = pixels[source];
      const g = pixels[source + 1];
      const b = pixels[source + 2];
      const a = pixels[source + 3];

      for (let oy = 0; oy < safeScale; oy += 1) {
        for (let ox = 0; ox < safeScale; ox += 1) {
          const dx = x * safeScale + ox;
          const dy = y * safeScale + oy;
          const target = (dy * width + dx) * 4;
          png.data[target] = r;
          png.data[target + 1] = g;
          png.data[target + 2] = b;
          png.data[target + 3] = a;
        }
      }
    }
  }

  return PNG.sync.write(png);
}
