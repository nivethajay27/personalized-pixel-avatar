export type BackgroundLayer = "sky" | "sunset" | "mint" | "void" | "aurora" | "peach" | "storm" | "neon";
export type SkinLayer = "light" | "tan" | "deep" | "alien";
export type EyeLayer = "classic" | "sleepy" | "cyber" | "happy" | "angry" | "stars" | "wink";
export type HairLayer = "none" | "short" | "mohawk" | "buns" | "curly" | "long" | "pixie" | "ponytail";
export type AccessoryLayer = "none" | "glasses" | "bandana" | "earring" | "headset" | "mask" | "cap" | "crown" | "visor";

export interface AvatarConfig {
  background: BackgroundLayer;
  skin: SkinLayer;
  eyes: EyeLayer;
  hair: HairLayer;
  accessory: AccessoryLayer;
}

export interface RenderOptions {
  size?: number;
  pixelScale?: number;
}

export interface AvatarValidationResult {
  valid: boolean;
  errors: string[];
}

export interface AvatarPresetItem<T extends string> {
  id: T;
  label: string;
  swatch: string;
}

export interface AvatarPresets {
  background: AvatarPresetItem<BackgroundLayer>[];
  skin: AvatarPresetItem<SkinLayer>[];
  eyes: AvatarPresetItem<EyeLayer>[];
  hair: AvatarPresetItem<HairLayer>[];
  accessory: AvatarPresetItem<AccessoryLayer>[];
}
