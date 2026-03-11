import type { AvatarConfig } from "@pixel/shared-types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function fetchRandomAvatar(seed?: string): Promise<AvatarConfig> {
  const response = await fetch(`${API_BASE}/api/avatar/random`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(seed ? { seed } : {})
  });

  if (!response.ok) {
    throw new Error("Failed to randomize avatar.");
  }

  const payload = (await response.json()) as { config: AvatarConfig };
  return payload.config;
}

export async function downloadAvatar(config: AvatarConfig): Promise<void> {
  const response = await fetch(`${API_BASE}/api/avatar/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, size: 16, scale: 24 })
  });

  if (!response.ok) {
    throw new Error("Failed to download avatar.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pixel-avatar-${Date.now()}.png`;
  anchor.click();
  URL.revokeObjectURL(url);
}
