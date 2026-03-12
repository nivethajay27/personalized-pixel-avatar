export type BackgroundLayer = "sky" | "sunset" | "mint" | "void" | "aurora" | "peach" | "storm" | "neon";
export type BackgroundPattern = "none" | "stripes" | "dots" | "checker";
export type SkinLayer = "light" | "tan" | "deep" | "alien";
export type EyeLayer = "classic" | "sleepy" | "cyber" | "happy" | "angry" | "stars" | "wink";
export type HairLayer = "none" | "short" | "mohawk" | "buns" | "curly" | "long" | "pixie" | "ponytail";
export type EyebrowLayer = "soft" | "straight" | "arch" | "fierce";
export type MouthLayer = "smile" | "neutral" | "open" | "smirk" | "teeth";
export type FacialHairLayer = "none" | "stubble" | "mustache" | "goatee" | "beard";
export type ClothingLayer = "tee" | "hoodie" | "jacket" | "armor";
export type HatLayer = "none" | "beanie" | "cap" | "crown";
export type AccessoryLayer = "none" | "glasses" | "bandana" | "earring" | "headset" | "mask" | "visor";

export interface AvatarConfig {
  background: BackgroundLayer;
  backgroundPattern: BackgroundPattern;
  backgroundAngle: number;
  skin: SkinLayer;
  skinColor?: string;
  eyes: EyeLayer;
  eyeColor?: string;
  hair: HairLayer;
  hairColor?: string;
  eyebrows: EyebrowLayer;
  mouth: MouthLayer;
  facialHair: FacialHairLayer;
  clothing: ClothingLayer;
  hat: HatLayer;
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
  backgroundPattern: AvatarPresetItem<BackgroundPattern>[];
  skin: AvatarPresetItem<SkinLayer>[];
  eyes: AvatarPresetItem<EyeLayer>[];
  hair: AvatarPresetItem<HairLayer>[];
  eyebrows: AvatarPresetItem<EyebrowLayer>[];
  mouth: AvatarPresetItem<MouthLayer>[];
  facialHair: AvatarPresetItem<FacialHairLayer>[];
  clothing: AvatarPresetItem<ClothingLayer>[];
  hat: AvatarPresetItem<HatLayer>[];
  accessory: AvatarPresetItem<AccessoryLayer>[];
}
