'use client';

import { useState } from 'react';
import Header from '/app/header.js';
import Footer from '/app/footer.js';

export default function ColorConverterPage() {
  const [colorInput, setColorInput] = useState('#EBE6E3');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const parseHex = (hex) => {
    const cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length !== 6) return null;

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return [r, g, b];
  };

  const parseRGB = (rgb) => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) return null;
    return [r, g, b];
  };

  const rgbToHsv = (r, g, b) => {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === red) {
        h = 60 * (((green - blue) / delta) % 6);
      } else if (max === green) {
        h = 60 * ((blue - red) / delta + 2);
      } else {
        h = 60 * ((red - green) / delta + 4);
      }
    }

    if (h < 0) h += 360;

    const s = max === 0 ? 0 : (delta / max) * 100;
    const v = max * 100;

    return [h, s, v];
  };

  const stardewRound = (value) => {
    const decimal = value - Math.floor(value);
    return decimal < 0.5 ? Math.floor(value) : Math.ceil(value);
  };

  const convertToStardew = (h, s, v) => {
    const stardewH = h / 3.6;
    const stardewS = s;
    const stardewV = v;

    return {
      decimal: [stardewH, stardewS, stardewV],
      rounded: [stardewRound(stardewH), stardewRound(stardewS), stardewRound(stardewV)],
    };
  };

  const handleConvert = () => {
    setError('');
    setResult(null);

    let rgb = null;
    const trimmed = colorInput.trim();

    if (trimmed) {
      rgb = parseHex(trimmed);
    }

    if (!rgb && trimmed) {
      rgb = parseRGB(trimmed);
    }

    if (!rgb) {
      setError('Invalid color format. Please enter a valid Hex (e.g., #EBE6E3) or RGB (e.g., rgb(235, 230, 227)).');
      return;
    }

    const [hsvH, hsvS, hsvV] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    const stardew = convertToStardew(hsvH, hsvS, hsvV);

    setResult({
      h: stardew.rounded[0],
      s: stardew.rounded[1],
      v: stardew.rounded[2],
      originalHsv: {
        h: Number(hsvH.toFixed(2)),
        s: Number(hsvS.toFixed(2)),
        v: Number(hsvV.toFixed(2)),
      },
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <main className="tool-page">
      <Header />
      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">Stardew Valley</div>
          <h1>RGB to Stardew Color Slider</h1>
          <p className="lede">
            Convert a color into the values used by Stardew Valley’s color sliders.
          </p>
        </div>
      </section>

      <section className="wrap tool-card">
        <div className="tool-panel">
          <label htmlFor="color-input">Color Input (Hex, RGB, or RGBA)</label>
          <input
            id="color-input"
            type="text"
            value={colorInput}
            onChange={(event) => setColorInput(event.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., #EBE6E1 or rgba(235, 230, 225)"
          />

          <button onClick={handleConvert}>Convert</button>

          {error ? <div className="tool-error">{error}</div> : null}

          <div className="tool-results">
            <div className="result-box">
              <h3>Actual HSV Values</h3>
              <p><strong>Hue:</strong> {result ? `${result.originalHsv.h}°` : '--'}</p>
              <p><strong>Saturation:</strong> {result ? `${result.originalHsv.s}%` : '--'}</p>
              <p><strong>Brightness:</strong> {result ? `${result.originalHsv.v}%` : '--'}</p>
            </div>

            <div className="result-box result-box-accent">
              <h3>Stardew Color Slider Values</h3>
              <p><strong>Hue:</strong> <span>{result ? result.h : '--'}</span></p>
              <p><strong>Saturation:</strong> <span>{result ? result.s : '--'}</span></p>
              <p><strong>Brightness:</strong> <span>{result ? result.v : '--'}</span></p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
