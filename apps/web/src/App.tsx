import { useMemo, useState } from "react";
import { DEFAULT_AVATAR_CONFIG, PRESETS, normalizeAvatarConfig, randomAvatarConfig } from "@pixel/avatar-engine";
import type { AvatarConfig } from "@pixel/shared-types";
import { AvatarCanvas } from "./components/AvatarCanvas";
import { LayerSelector } from "./components/LayerSelector";
import { downloadAvatar, fetchRandomAvatar } from "./lib/api";

const initialSeed = "neo-city";

export function App(): JSX.Element {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [seed, setSeed] = useState<string>(initialSeed);
  const [status, setStatus] = useState<string>("Pick layers or randomize to start.");
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const profileName = useMemo(
    () => `${config.hair.toUpperCase()}-${config.eyes.toUpperCase()}-${config.accessory.toUpperCase()}`,
    [config]
  );

  const patchConfig = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    const next = normalizeAvatarConfig({ ...config, [key]: value });
    setConfig(next);
  };

  const randomize = async (): Promise<void> => {
    setIsBusy(true);
    try {
      const next = await fetchRandomAvatar(seed);
      setConfig(normalizeAvatarConfig(next));
      setStatus(`Randomized with seed \"${seed || "generated"}\".`);
    } catch {
      const fallback = randomAvatarConfig(seed);
      setConfig(fallback);
      setStatus("API unavailable, randomization generated locally.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDownload = async (): Promise<void> => {
    setIsBusy(true);
    try {
      await downloadAvatar(config);
      setStatus("Downloaded PNG avatar.");
    } catch {
      setStatus("Could not reach API for download. Start backend at port 8080.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <main className="layout">
        <section className="hero-card">
          <p className="kicker">PIXEL PERSONA LAB</p>
          <h1>Design a custom avatar with layered pixel traits.</h1>
          <p className="subtitle">
            Blend backgrounds, skin tones, eye styles, hair silhouettes, and accessories. Export crisp PNGs instantly.
          </p>

          <div className="seed-row">
            <label htmlFor="seed-input">Seed</label>
            <input
              id="seed-input"
              type="text"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="type seed for deterministic results"
            />
            <button type="button" className="action-button" onClick={randomize} disabled={isBusy}>
              {isBusy ? "Working..." : "Randomize"}
            </button>
          </div>

          <p className="status-line">{status}</p>
        </section>

        <section className="preview-card">
          <div className="preview-frame">
            <AvatarCanvas config={config} />
          </div>
          <div className="preview-meta">
            <span className="badge">Profile ID: {profileName}</span>
            <button type="button" className="download-button" onClick={handleDownload} disabled={isBusy}>
              Download PNG
            </button>
          </div>
        </section>

        <section className="controls-card">
          <LayerSelector label="Background" value={config.background} options={PRESETS.background} onChange={(value) => patchConfig("background", value)} />
          <LayerSelector label="Skin" value={config.skin} options={PRESETS.skin} onChange={(value) => patchConfig("skin", value)} />
          <LayerSelector label="Eyes" value={config.eyes} options={PRESETS.eyes} onChange={(value) => patchConfig("eyes", value)} />
          <LayerSelector label="Hair" value={config.hair} options={PRESETS.hair} onChange={(value) => patchConfig("hair", value)} />
          <LayerSelector
            label="Accessory"
            value={config.accessory}
            options={PRESETS.accessory}
            onChange={(value) => patchConfig("accessory", value)}
          />
        </section>
      </main>
    </div>
  );
}
