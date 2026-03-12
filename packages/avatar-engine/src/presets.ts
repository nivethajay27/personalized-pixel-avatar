import type { AvatarPresets } from "@pixel/shared-types";

export const PRESETS: AvatarPresets = {
  background: [
    { id: "sky", label: "Sky Drift", swatch: "#7dd3fc" },
    { id: "sunset", label: "Sunset Glow", swatch: "#fb7185" },
    { id: "mint", label: "Mint Grid", swatch: "#5eead4" },
    { id: "void", label: "Midnight", swatch: "#0f172a" },
    { id: "aurora", label: "Aurora Veil", swatch: "#34d399" },
    { id: "peach", label: "Peach Haze", swatch: "#fdba74" },
    { id: "storm", label: "Storm Front", swatch: "#94a3b8" },
    { id: "neon", label: "Neon Byte", swatch: "#22d3ee" }
  ],
  backgroundPattern: [
    { id: "none", label: "Clean", swatch: "#0f172a" },
    { id: "stripes", label: "Stripes", swatch: "#38bdf8" },
    { id: "dots", label: "Dots", swatch: "#f472b6" },
    { id: "checker", label: "Checker", swatch: "#22c55e" }
  ],
  skin: [
    { id: "light", label: "Light", swatch: "#f5d2b3" },
    { id: "tan", label: "Tan", swatch: "#d9a273" },
    { id: "deep", label: "Deep", swatch: "#7b4a2c" },
    { id: "alien", label: "Alien", swatch: "#86efac" }
  ],
  eyes: [
    { id: "classic", label: "Classic", swatch: "#0f172a" },
    { id: "sleepy", label: "Sleepy", swatch: "#334155" },
    { id: "cyber", label: "Cyber", swatch: "#22d3ee" },
    { id: "happy", label: "Happy", swatch: "#f97316" },
    { id: "angry", label: "Angry", swatch: "#ef4444" },
    { id: "stars", label: "Starry", swatch: "#facc15" },
    { id: "wink", label: "Wink", swatch: "#38bdf8" }
  ],
  hair: [
    { id: "none", label: "No Hair", swatch: "#64748b" },
    { id: "short", label: "Short", swatch: "#7c3aed" },
    { id: "mohawk", label: "Mohawk", swatch: "#f97316" },
    { id: "buns", label: "Space Buns", swatch: "#f43f5e" },
    { id: "curly", label: "Curly", swatch: "#22c55e" },
    { id: "long", label: "Long", swatch: "#0ea5e9" },
    { id: "pixie", label: "Pixie", swatch: "#a855f7" },
    { id: "ponytail", label: "Ponytail", swatch: "#f59e0b" }
  ],
  eyebrows: [
    { id: "soft", label: "Soft", swatch: "#94a3b8" },
    { id: "straight", label: "Straight", swatch: "#64748b" },
    { id: "arch", label: "Arch", swatch: "#c084fc" },
    { id: "fierce", label: "Fierce", swatch: "#f87171" }
  ],
  mouth: [
    { id: "smile", label: "Smile", swatch: "#f97316" },
    { id: "neutral", label: "Neutral", swatch: "#cbd5f5" },
    { id: "open", label: "Open", swatch: "#f43f5e" },
    { id: "smirk", label: "Smirk", swatch: "#a78bfa" },
    { id: "teeth", label: "Teeth", swatch: "#e2e8f0" }
  ],
  facialHair: [
    { id: "none", label: "None", swatch: "#64748b" },
    { id: "stubble", label: "Stubble", swatch: "#475569" },
    { id: "mustache", label: "Mustache", swatch: "#1f2937" },
    { id: "goatee", label: "Goatee", swatch: "#0f172a" },
    { id: "beard", label: "Beard", swatch: "#111827" }
  ],
  clothing: [
    { id: "tee", label: "Tee", swatch: "#38bdf8" },
    { id: "hoodie", label: "Hoodie", swatch: "#a855f7" },
    { id: "jacket", label: "Jacket", swatch: "#f97316" },
    { id: "armor", label: "Armor", swatch: "#64748b" }
  ],
  hat: [
    { id: "none", label: "None", swatch: "#64748b" },
    { id: "beanie", label: "Beanie", swatch: "#0ea5e9" },
    { id: "cap", label: "Cap", swatch: "#475569" },
    { id: "crown", label: "Crown", swatch: "#facc15" }
  ],
  accessory: [
    { id: "none", label: "None", swatch: "#64748b" },
    { id: "glasses", label: "Glasses", swatch: "#111827" },
    { id: "bandana", label: "Bandana", swatch: "#ec4899" },
    { id: "earring", label: "Earring", swatch: "#facc15" },
    { id: "headset", label: "Headset", swatch: "#22d3ee" },
    { id: "mask", label: "Mask", swatch: "#0ea5e9" },
    { id: "visor", label: "Visor", swatch: "#67e8f9" }
  ]
};

export const BACKGROUND_IDS = PRESETS.background.map((item) => item.id);
export const BACKGROUND_PATTERN_IDS = PRESETS.backgroundPattern.map((item) => item.id);
export const SKIN_IDS = PRESETS.skin.map((item) => item.id);
export const EYE_IDS = PRESETS.eyes.map((item) => item.id);
export const HAIR_IDS = PRESETS.hair.map((item) => item.id);
export const EYEBROW_IDS = PRESETS.eyebrows.map((item) => item.id);
export const MOUTH_IDS = PRESETS.mouth.map((item) => item.id);
export const FACIAL_HAIR_IDS = PRESETS.facialHair.map((item) => item.id);
export const CLOTHING_IDS = PRESETS.clothing.map((item) => item.id);
export const HAT_IDS = PRESETS.hat.map((item) => item.id);
export const ACCESSORY_IDS = PRESETS.accessory.map((item) => item.id);
