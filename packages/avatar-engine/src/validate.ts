import type { AvatarConfig, AvatarValidationResult } from "@pixel/shared-types";
import { ACCESSORY_IDS, BACKGROUND_IDS, EYE_IDS, HAIR_IDS, SKIN_IDS } from "./presets";

export function validateAvatarConfig(config: AvatarConfig): AvatarValidationResult {
  const errors: string[] = [];

  if (!BACKGROUND_IDS.includes(config.background)) {
    errors.push(`Unknown background: ${config.background}`);
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
  if (!ACCESSORY_IDS.includes(config.accessory)) {
    errors.push(`Unknown accessory: ${config.accessory}`);
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
    skin: SKIN_IDS.includes(config.skin as AvatarConfig["skin"]) ? (config.skin as AvatarConfig["skin"]) : "tan",
    eyes: EYE_IDS.includes(config.eyes as AvatarConfig["eyes"]) ? (config.eyes as AvatarConfig["eyes"]) : "classic",
    hair: HAIR_IDS.includes(config.hair as AvatarConfig["hair"]) ? (config.hair as AvatarConfig["hair"]) : "short",
    accessory: ACCESSORY_IDS.includes(config.accessory as AvatarConfig["accessory"]) ? (config.accessory as AvatarConfig["accessory"]) : "none"
  };

  if (normalized.hair === "buns" && normalized.accessory === "headset") {
    normalized.accessory = "none";
  }

  return normalized;
}
