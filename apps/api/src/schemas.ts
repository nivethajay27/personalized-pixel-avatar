import { z } from "zod";

export const avatarConfigSchema = z.object({
  background: z.enum(["sky", "sunset", "mint", "void", "aurora", "peach", "storm", "neon"]),
  backgroundPattern: z.enum(["none", "stripes", "dots", "checker"]).optional(),
  backgroundAngle: z.number().min(0).max(180).optional(),
  skin: z.enum(["light", "tan", "deep", "alien"]),
  skinColor: z.string().optional(),
  eyes: z.enum(["classic", "sleepy", "cyber", "happy", "angry", "stars", "wink"]),
  eyeColor: z.string().optional(),
  hair: z.enum(["none", "short", "mohawk", "buns", "curly", "long", "pixie", "ponytail"]),
  hairColor: z.string().optional(),
  eyebrows: z.enum(["soft", "straight", "arch", "fierce"]).optional(),
  mouth: z.enum(["smile", "neutral", "open", "smirk", "teeth"]).optional(),
  facialHair: z.enum(["none", "stubble", "mustache", "goatee", "beard"]).optional(),
  clothing: z.enum(["tee", "hoodie", "jacket", "armor"]).optional(),
  hat: z.enum(["none", "beanie", "cap", "crown"]).optional(),
  accessory: z.enum(["none", "glasses", "bandana", "earring", "headset", "mask", "visor"]).optional()
});

export const renderRequestSchema = z.object({
  config: avatarConfigSchema,
  scale: z.number().int().min(4).max(64).optional(),
  size: z.number().int().min(12).max(64).optional()
});

export const randomRequestSchema = z.object({
  seed: z.string().trim().min(1).max(128).optional()
});
