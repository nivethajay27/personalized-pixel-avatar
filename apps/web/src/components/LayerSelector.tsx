import type { AvatarPresetItem } from "@pixel/shared-types";

interface LayerSelectorProps<T extends string> {
  label: string;
  value: T;
  options: AvatarPresetItem<T>[];
  onChange: (nextValue: T) => void;
}

export function LayerSelector<T extends string>({ label, value, options, onChange }: LayerSelectorProps<T>): JSX.Element {
  return (
    <section className="layer-group">
      <header className="layer-header">
        <h3>{label}</h3>
      </header>
      <div className="chip-grid">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              className={`chip ${selected ? "chip-selected" : ""}`}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
            >
              <span className="chip-swatch" style={{ backgroundColor: option.swatch }} />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
