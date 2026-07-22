'use client';

import { useState } from 'react';
import Header from '/app/header.js';
import Footer from '/app/footer.js';

const clampLevel = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 1;
  return Math.min(125, Math.max(1, parsed));
};

const calculateGrowtopiaExp = ({ currentLevel, targetLevel, currentExp }) => {
  const clvl = clampLevel(currentLevel);
  const tlvl = clampLevel(targetLevel);
  const xp = Number.isNaN(Number.parseInt(currentExp, 10)) ? 0 : Number.parseInt(currentExp, 10);

  if (clvl >= tlvl) {
    return {
      success: false,
      message: clvl === tlvl ? 'Your current and target levels are the same, so no EXP is needed.' : 'Target level must be higher than your current level.',
    };
  }

  let totalXp = 0;
  let level = clvl;

  while (level < tlvl) {
    totalXp += 50 * (level ** 2 + 2);
    level += 1;
  }

  totalXp -= xp;
  if (totalXp < 0) totalXp = 0;

  return {
    success: true,
    amount: totalXp,
    message: 'EXP remaining to reach your target level.',
  };
};

export default function GrowtopiaExpCalculatorPage() {
  const [currentLevel, setCurrentLevel] = useState('1');
  const [targetLevel, setTargetLevel] = useState('2');
  const [currentExp, setCurrentExp] = useState('0');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const parsedResult = calculateGrowtopiaExp({
      currentLevel,
      targetLevel,
      currentExp,
    });

    if (!parsedResult.success) {
      setResult(null);
      setError(parsedResult.message);
      return;
    }

    setResult(parsedResult);
  };

  return (
    <main className="tool-page">
      <Header />

      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">Growtopia</div>
          <h1>EXP Calculator</h1>
          <p className="lede">
            Estimate how much Growtopia EXP is still needed to reach a target level from your current level and current EXP.
          </p>
        </div>
      </section>

      <section className="wrap tool-card">
        <div className="tool-panel">
          <form onSubmit={handleSubmit}>
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
                <label htmlFor="growtopia-current">Current Level</label>
                <input
                id="growtopia-current"
                type="number"
                min="1"
                max="125"
                value={currentLevel}
                onChange={(event) => setCurrentLevel(event.target.value)}
                />
            </div>
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
                <label htmlFor="growtopia-target">Target Level</label>
                <input
                id="growtopia-target"
                type="number"
                min="2"
                max="125"
                value={targetLevel}
                onChange={(event) => setTargetLevel(event.target.value)}
                />
            </div>
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
                <label htmlFor="growtopia-exp">Current EXP</label>
                <input
                id="growtopia-exp"
                type="number"
                min="0"
                step="1"
                value={currentExp}
                onChange={(event) => setCurrentExp(event.target.value)}
                />
            </div>
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
                <button type="submit">Calculate</button>
            </div>
          </form>

          {error ? <div className="tool-error">{error}</div> : null}

          {result ? (
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
              <div className="result-box result-box-accent">
                <h3>Result</h3>
                <p>
                  <strong>EXP Needed:</strong>{' '}
                  <span>{result.amount.toLocaleString()} XP</span>
                </p>
                <p>{result.message}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}
