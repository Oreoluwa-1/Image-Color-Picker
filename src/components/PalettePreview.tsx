"use client";

import React from "react";
import ColorSwatch from "./ColorSwatch";

type Props = {
  dataUrl: string | null;
  palette: string[]; // array of hex colors
  dominant?: string | null;
  onApplyTheme?: (cssVars: Record<string, string>) => void;
};

export default function PalettePreview({ dataUrl, palette, dominant, onApplyTheme }: Props) {
  return (
    <div className="space-y-4">
      {dataUrl && (
        <div className="flex justify-center">
          <img src={dataUrl} alt="Uploaded" className="max-h-64 rounded-lg shadow-md object-contain" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dominant && <ColorSwatch hex={dominant} label="Dominant" />}
        {palette.map((hex, i) => (
          <ColorSwatch hex={hex} key={i} label={`Palette ${i + 1}`} />
        ))}
      </div>

      {onApplyTheme && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              const vars: Record<string, string> = {};
              if (dominant) vars["--accent"] = dominant;
              palette.forEach((c, i) => (vars[`--p-${i + 1}`] = c));
              onApplyTheme(vars);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Apply colors to page
          </button>
        </div>
      )}
    </div>
  );
}
