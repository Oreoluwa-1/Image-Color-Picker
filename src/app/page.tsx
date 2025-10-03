"use client";

import React, { useCallback, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import PalettePreview from "@/components/PalettePreview";
import Color from "tinycolor2";

export default function HomePage() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [dominant, setDominant] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // function to convert [r,g,b] to hex string
  const rgbToHex = (rgb: number[]) => {
    return Color({ r: rgb[0], g: rgb[1], b: rgb[2] }).toHexString();
  };

  // When an image is dropped, we create an Image and run ColorThief
  const handleFile = useCallback(async (url: string) => {
    setError(null);
    setDataUrl(url);
    setDominant(null);
    setPalette([]);

    try {
      // import ColorThief dynamically (client-side only)
     const ColorThief = (await import("color-thief-browser")).default;


      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // important for cross-origin images
        img.onload = () => {
          try {
            const ct = new ColorThief();
            // get dominant color
            const dom = ct.getColor(img);
            // get palette (5 colors)
            const pal = ct.getPalette(img, 6) || [];
            setDominant(rgbToHex(dom));
            setPalette(pal.map(rgbToHex));
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = (e) => {
          reject(new Error("Failed to load image for color extraction"));
        };
        img.src = url;
        // If the image is already cached and complete, try run onload
        if (img.complete) {
          // some browsers may not call onload if already complete, so do a microtask
          setTimeout(() => {
            if (img.naturalWidth) {
              try {
                const ct = new (require("color-thief-browser").default)();
                const dom = ct.getColor(img);
                const pal = ct.getPalette(img, 6) || [];
                setDominant(rgbToHex(dom));
                setPalette(pal.map(rgbToHex));
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          }, 0);
        }
      });
    } catch (err: any) {
      console.error(err);
      setError("Could not extract colors from this image. Try another file or a local image.");
    }
  }, []);

  // apply CSS variables to document root (used for dynamic theme)
  const applyTheme = (vars: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8" style={{
      // use CSS var for accent if set (fallback)
      background: 'linear-gradient(180deg,var(--accent, #e9d5ff), #f8fafc)'
    }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Image Color Picker 🎨</h1>

        <ImageDropzone onFileDataUrl={(d) => handleFile(d)} />

        <div className="mt-6">
          {error && <div className="text-red-600">{error}</div>}

          <PalettePreview
            dataUrl={dataUrl}
            dominant={dominant}
            palette={palette}
            onApplyTheme={(vars) => applyTheme(vars)}
          />
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Tip: Use cross-origin images (from other domains) may fail color extraction unless the image supports CORS.
        </div>
      </div>
    </main>
  );
}
