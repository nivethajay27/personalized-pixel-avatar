import express from "express";
import cors from "cors";
import { PRESETS, normalizeAvatarConfig, randomAvatarConfig, renderAvatarPixels, validateAvatarConfig } from "@pixel/avatar-engine";
import type { AvatarConfig } from "@pixel/shared-types";
import { pixelsToPngBuffer } from "./png";
import { randomRequestSchema, renderRequestSchema } from "./schemas";

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pixel-avatar-api" });
});

app.get("/api/presets", (_req, res) => {
  res.json({ presets: PRESETS });
});

app.post("/api/avatar/random", (req, res) => {
  const parsed = randomRequestSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }

  const config = randomAvatarConfig(parsed.data.seed);
  return res.json({ config });
});

app.post("/api/avatar/render", (req, res) => {
  const parsed = renderRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const config: AvatarConfig = normalizeAvatarConfig(parsed.data.config);
  const validation = validateAvatarConfig(config);

  if (!validation.valid) {
    return res.status(400).json({ error: "Invalid avatar config", details: validation.errors });
  }

  const size = parsed.data.size ?? 16;
  const scale = parsed.data.scale ?? 16;
  const pixels = renderAvatarPixels(config, size);
  const pngBuffer = pixelsToPngBuffer(pixels, size, scale);

  return res.json({
    config,
    size,
    scale,
    pngBase64: pngBuffer.toString("base64"),
    dataUrl: `data:image/png;base64,${pngBuffer.toString("base64")}`
  });
});

app.post("/api/avatar/download", (req, res) => {
  const parsed = renderRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const config = normalizeAvatarConfig(parsed.data.config);
  const size = parsed.data.size ?? 16;
  const scale = parsed.data.scale ?? 16;
  const pixels = renderAvatarPixels(config, size);
  const pngBuffer = pixelsToPngBuffer(pixels, size, scale);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=avatar.png");
  return res.send(pngBuffer);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Pixel Avatar API listening on http://localhost:${PORT}`);
});
