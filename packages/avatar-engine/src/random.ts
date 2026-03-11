import type { AvatarConfig } from "@pixel/shared-types";
import { ACCESSORY_IDS, BACKGROUND_IDS, EYE_IDS, HAIR_IDS, SKIN_IDS } from "./presets";
import { normalizeAvatarConfig } from "./validate";

function xmur3(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

export function randomAvatarConfig(seed?: string): AvatarConfig {
  const safeSeed = seed?.trim() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const hash = xmur3(safeSeed)();
  const rng = mulberry32(hash);

  return normalizeAvatarConfig({
    background: pick(BACKGROUND_IDS, rng),
    skin: pick(SKIN_IDS, rng),
    eyes: pick(EYE_IDS, rng),
    hair: pick(HAIR_IDS, rng),
    accessory: pick(ACCESSORY_IDS, rng)
  });
}
