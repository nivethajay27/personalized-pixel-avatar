import type { AvatarConfig, AvatarValidationResult } from "@pixel/shared-types";
import {
  ACCESSORY_IDS,
  BACKGROUND_IDS,
  BACKGROUND_PATTERN_IDS,
  CLOTHING_IDS,
  EYEBROW_IDS,
  EYE_IDS,
  FACIAL_HAIR_IDS,
  HAIR_IDS,
  HAT_IDS,
  MOUTH_IDS,
  SKIN_IDS
} from "./presets.js";

function isHexColor(value: string | undefined): value is string {
  if (!value) {
    return false;
  }
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

export function validateAvatarConfig(config: AvatarConfig): AvatarValidationResult {
  const errors: string[] = [];

  if (!BACKGROUND_IDS.includes(config.background)) {
    errors.push(`Unknown background: ${config.background}`);
  }
  if (!BACKGROUND_PATTERN_IDS.includes(config.backgroundPattern)) {
    errors.push(`Unknown background pattern: ${config.backgroundPattern}`);
  }
  if (!SKIN_IDS.includes(config.skin)) {
    errors.push(`Unknown skin: ${config.skin}`);
  }
  if (!EYE_IDS.includes(config.eyes)) {
    errors.push(`Unknown eyes: ${config.eyes}`);
  }
  if (!HAIR_IDS.includes(config.hair)) {
    errors.push(`Unknown hair: ${config.hair}`);
  }
  if (!EYEBROW_IDS.includes(config.eyebrows)) {
    errors.push(`Unknown eyebrows: ${config.eyebrows}`);
  }
  if (!MOUTH_IDS.includes(config.mouth)) {
    errors.push(`Unknown mouth: ${config.mouth}`);
  }
  if (!FACIAL_HAIR_IDS.includes(config.facialHair)) {
    errors.push(`Unknown facial hair: ${config.facialHair}`);
  }
  if (!CLOTHING_IDS.includes(config.clothing)) {
    errors.push(`Unknown clothing: ${config.clothing}`);
  }
  if (!HAT_IDS.includes(config.hat)) {
    errors.push(`Unknown hat: ${config.hat}`);
  }
  if (!ACCESSORY_IDS.includes(config.accessory)) {
    errors.push(`Unknown accessory: ${config.accessory}`);
  }
  if (Number.isNaN(config.backgroundAngle) || config.backgroundAngle < 0 || config.backgroundAngle > 180) {
    errors.push(`Background angle out of range: ${config.backgroundAngle}`);
  }
  if (config.skinColor && !isHexColor(config.skinColor)) {
    errors.push(`Invalid skin color: ${config.skinColor}`);
  }
  if (config.eyeColor && !isHexColor(config.eyeColor)) {
    errors.push(`Invalid eye color: ${config.eyeColor}`);
  }
  if (config.hairColor && !isHexColor(config.hairColor)) {
    errors.push(`Invalid hair color: ${config.hairColor}`);
  }

  if (config.hair === "buns" && config.accessory === "headset") {
    errors.push("Headset does not fit with space buns.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function normalizeAvatarConfig(config: Partial<AvatarConfig>): AvatarConfig {
  const normalized: AvatarConfig = {
    background: BACKGROUND_IDS.includes(config.background as AvatarConfig["background"]) ? (config.background as AvatarConfig["background"]) : "sky",
    backgroundPattern: BACKGROUND_PATTERN_IDS.includes(config.backgroundPattern as AvatarConfig["backgroundPattern"])
      ? (config.backgroundPattern as AvatarConfig["backgroundPattern"])
      : "none",
    backgroundAngle: typeof config.backgroundAngle === "number" ? Math.min(180, Math.max(0, config.backgroundAngle)) : 90,
    skin: SKIN_IDS.includes(config.skin as AvatarConfig["skin"]) ? (config.skin as AvatarConfig["skin"]) : "tan",
    skinColor: isHexColor(config.skinColor) ? config.skinColor : undefined,
    eyes: EYE_IDS.includes(config.eyes as AvatarConfig["eyes"]) ? (config.eyes as AvatarConfig["eyes"]) : "classic",
    eyeColor: isHexColor(config.eyeColor) ? config.eyeColor : undefined,
    hair: HAIR_IDS.includes(config.hair as AvatarConfig["hair"]) ? (config.hair as AvatarConfig["hair"]) : "short",
    hairColor: isHexColor(config.hairColor) ? config.hairColor : undefined,
    eyebrows: EYEBROW_IDS.includes(config.eyebrows as AvatarConfig["eyebrows"]) ? (config.eyebrows as AvatarConfig["eyebrows"]) : "soft",
    mouth: MOUTH_IDS.includes(config.mouth as AvatarConfig["mouth"]) ? (config.mouth as AvatarConfig["mouth"]) : "smile",
    facialHair: FACIAL_HAIR_IDS.includes(config.facialHair as AvatarConfig["facialHair"])
      ? (config.facialHair as AvatarConfig["facialHair"])
      : "none",
    clothing: CLOTHING_IDS.includes(config.clothing as AvatarConfig["clothing"]) ? (config.clothing as AvatarConfig["clothing"]) : "tee",
    hat: HAT_IDS.includes(config.hat as AvatarConfig["hat"]) ? (config.hat as AvatarConfig["hat"]) : "none",
    accessory: ACCESSORY_IDS.includes(config.accessory as AvatarConfig["accessory"]) ? (config.accessory as AvatarConfig["accessory"]) : "none"
  };

  if (normalized.hair === "buns" && normalized.accessory === "headset") {
    normalized.accessory = "none";
  }

  return normalized;
}
