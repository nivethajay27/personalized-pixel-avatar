import { z } from "zod";

export const avatarConfigSchema = z.object({
  background: z.enum(["sky", "sunset", "mint", "void"]),
  skin: z.enum(["light", "tan", "deep", "alien"]),
  eyes: z.enum(["classic", "sleepy", "cyber"]),
  hair: z.enum(["none", "short", "mohawk", "buns"]),
  accessory: z.enum(["none", "glasses", "bandana", "earring", "headset"])
});

export const renderRequestSchema = z.object({
  config: avatarConfigSchema,
  scale: z.number().int().min(4).max(64).optional(),
  size: z.number().int().min(12).max(64).optional()
});

export const randomRequestSchema = z.object({
  seed: z.string().trim().min(1).max(128).optional()
});
