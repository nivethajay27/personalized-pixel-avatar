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
  const [history, setHistory] = useState<AvatarConfig[]>([]);
  const [favorites, setFavorites] = useState<AvatarConfig[]>([]);

  const profileName = useMemo(
    () => `${config.hair.toUpperCase()}-${config.eyes.toUpperCase()}-${config.accessory.toUpperCase()}-${config.hat.toUpperCase()}`,
    [config]
  );

  const areConfigsEqual = (left: AvatarConfig, right: AvatarConfig): boolean => JSON.stringify(left) === JSON.stringify(right);

  const pushHistory = (snapshot: AvatarConfig) => {
    setHistory((prev) => [...prev.slice(-5), snapshot]);
  };

  const applyConfig = (next: AvatarConfig, message?: string) => {
    setConfig(next);
    if (message) {
      setStatus(message);
    }
  };

  const patchConfig = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    const next = normalizeAvatarConfig({ ...config, [key]: value });
    if (areConfigsEqual(next, config)) {
      return;
    }
    pushHistory(config);
    setConfig(next);
  };

  const randomize = async (): Promise<void> => {
    setIsBusy(true);
    try {
      const next = await fetchRandomAvatar(seed);
      pushHistory(config);
      setConfig(normalizeAvatarConfig(next));
      setStatus(`Randomized with seed \"${seed || "generated"}\".`);
    } catch {
      const fallback = randomAvatarConfig(seed);
      pushHistory(config);
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

  const undo = () => {
    setHistory((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const nextHistory = prev.slice(0, -1);
      const previousConfig = prev[prev.length - 1];
      applyConfig(previousConfig, "Undid last change.");
      return nextHistory;
    });
  };

  const addFavorite = () => {
    setFavorites((prev) => {
      if (prev.some((item) => areConfigsEqual(item, config))) {
        return prev;
      }
      return [config, ...prev].slice(0, 12);
    });
    setStatus("Saved to favorites.");
  };

  const removeFavorite = (index: number) => {
    setFavorites((prev) => prev.filter((_, i) => i !== index));
  };

  const applyFavorite = (favorite: AvatarConfig) => {
    pushHistory(config);
    applyConfig(favorite, "Applied favorite.");
  };

  const applyHistorySnapshot = (snapshot: AvatarConfig) => {
    pushHistory(config);
    applyConfig(snapshot, "Restored from history.");
  };

  const swatchFor = (list: { id: string; swatch: string }[], id: string) => list.find((item) => item.id === id)?.swatch ?? "#ffffff";
  const skinSwatch = swatchFor(PRESETS.skin, config.skin);
  const hairSwatch = swatchFor(PRESETS.hair, config.hair);
  const eyeSwatch = swatchFor(PRESETS.eyes, config.eyes);

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <main className="layout">
        <section className="hero-card">
          <p className="kicker">PIXEL PERSONA LAB</p>
          <h1>Design a custom avatar with layered pixel traits.</h1>
          <p className="subtitle">
            Blend backgrounds, skin tones, eyes, hair, clothing, hats, and accessories. Export crisp PNGs instantly.
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
          <div className="controls-layout">
            <div className="controls-primary">
              <div className="control-actions">
                <button type="button" className="action-button" onClick={undo} disabled={history.length === 0}>
                  Undo
                </button>
                <button type="button" className="action-button ghost" onClick={addFavorite}>
                  Save Favorite
                </button>
              </div>
              <LayerSelector label="Background" value={config.background} options={PRESETS.background} onChange={(value) => patchConfig("background", value)} />
              <LayerSelector
                label="Background Pattern"
                value={config.backgroundPattern}
                options={PRESETS.backgroundPattern}
                onChange={(value) => patchConfig("backgroundPattern", value)}
              />
              <div className="slider-row">
                <label htmlFor="background-angle">Gradient Angle</label>
                <input
                  id="background-angle"
                  type="range"
                  min={0}
                  max={180}
                  step={5}
                  value={config.backgroundAngle}
                  onChange={(event) => patchConfig("backgroundAngle", Number(event.target.value))}
                />
                <span className="slider-value">{config.backgroundAngle}°</span>
              </div>
              <LayerSelector label="Skin" value={config.skin} options={PRESETS.skin} onChange={(value) => patchConfig("skin", value)} />
              <LayerSelector label="Eyes" value={config.eyes} options={PRESETS.eyes} onChange={(value) => patchConfig("eyes", value)} />
              <LayerSelector label="Hair" value={config.hair} options={PRESETS.hair} onChange={(value) => patchConfig("hair", value)} />
              <LayerSelector label="Eyebrows" value={config.eyebrows} options={PRESETS.eyebrows} onChange={(value) => patchConfig("eyebrows", value)} />
              <LayerSelector label="Mouth" value={config.mouth} options={PRESETS.mouth} onChange={(value) => patchConfig("mouth", value)} />
              <LayerSelector label="Facial Hair" value={config.facialHair} options={PRESETS.facialHair} onChange={(value) => patchConfig("facialHair", value)} />
              <LayerSelector label="Clothing" value={config.clothing} options={PRESETS.clothing} onChange={(value) => patchConfig("clothing", value)} />
              <LayerSelector label="Hat" value={config.hat} options={PRESETS.hat} onChange={(value) => patchConfig("hat", value)} />
              <LayerSelector
                label="Accessory"
                value={config.accessory}
                options={PRESETS.accessory}
                onChange={(value) => patchConfig("accessory", value)}
              />
            </div>

            <div className="controls-secondary">
              <div className="palette-section">
                <h3>Palette Controls</h3>
                <div className="palette-row">
                  <label htmlFor="skin-color">Skin Color</label>
                  <input
                    id="skin-color"
                    type="color"
                    value={config.skinColor ?? skinSwatch}
                    onChange={(event) => patchConfig("skinColor", event.target.value)}
                  />
                  <button type="button" className="ghost" onClick={() => patchConfig("skinColor", undefined)}>
                    Reset
                  </button>
                </div>
                <div className="palette-row">
                  <label htmlFor="eye-color">Eye Color</label>
                  <input
                    id="eye-color"
                    type="color"
                    value={config.eyeColor ?? eyeSwatch}
                    onChange={(event) => patchConfig("eyeColor", event.target.value)}
                  />
                  <button type="button" className="ghost" onClick={() => patchConfig("eyeColor", undefined)}>
                    Reset
                  </button>
                </div>
                <div className="palette-row">
                  <label htmlFor="hair-color">Hair Color</label>
                  <input
                    id="hair-color"
                    type="color"
                    value={config.hairColor ?? hairSwatch}
                    onChange={(event) => patchConfig("hairColor", event.target.value)}
                  />
                  <button type="button" className="ghost" onClick={() => patchConfig("hairColor", undefined)}>
                    Reset
                  </button>
                </div>
              </div>

              <div className="history-section">
                <h3>History</h3>
                {history.length === 0 ? (
                  <p className="muted">No history yet.</p>
                ) : (
                  <div className="mini-grid">
                {history.slice(-6).reverse().map((item, index) => (
                      <div key={`history-${index}`} className="mini-card">
                        <AvatarCanvas config={item} size={16} scale={6} className="avatar-canvas mini-avatar" />
                        <button type="button" className="ghost" onClick={() => applyHistorySnapshot(item)}>
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="favorites-section">
                <h3>Favorites</h3>
                {favorites.length === 0 ? (
                  <p className="muted">Save a look to keep it here.</p>
                ) : (
                  <div className="mini-grid">
                    {favorites.map((item, index) => (
                      <div key={`favorite-${index}`} className="mini-card">
                        <AvatarCanvas config={item} size={16} scale={6} className="avatar-canvas mini-avatar" />
                        <div className="mini-actions">
                          <button type="button" className="ghost" onClick={() => applyFavorite(item)}>
                            Apply
                          </button>
                          <button type="button" className="ghost" onClick={() => removeFavorite(index)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
