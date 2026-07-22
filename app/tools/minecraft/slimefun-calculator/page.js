'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '/app/header.js';
import Footer from '/app/footer.js';

const BLACKLISTED_ITEMS = ['UU_MATTER', 'SILICON', 'RUBBER', 'VOID_BIT'];
const BLACKLISTED_RECIPES = [
  'ore_washer',
  'geo_miner',
  'gold_pan',
  'mob_drop',
  'barter_drop',
  'ore_crusher',
  'multiblock',
  'meteor_attractor',
  'alien_drop',
  'world_gen',
];

const stripColorCodes = (value = '') => value.replace(/§[0-9a-fk-or]/gi, '').trim();

export default function SlimefunCalculatorPage() {
  const [itemId, setItemId] = useState('');
  const [amount, setAmount] = useState(1);
  const [items, setItems] = useState([]);
  const [itemMap, setItemMap] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch('/slimefun-items.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load the Slimefun item list right now.');
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;

        const nextMap = {};
        data.forEach((entry) => {
          nextMap[entry.id] = entry;
        });

        setItems(data || []);
        setItemMap(nextMap);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
        setError('Unable to load the Slimefun item database. Please try again in a moment.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const itemSuggestions = useMemo(() => items.map((item) => item.id).sort(), [items]);

  const getNextItem = (map) => {
    for (const [id, amountNeeded] of Object.entries(map)) {
      if (amountNeeded <= 0) continue;
      if (id !== id.toUpperCase()) continue;

      const candidate = itemMap[id];
      if (!candidate) continue;
      if (BLACKLISTED_ITEMS.includes(id)) continue;
      if (BLACKLISTED_RECIPES.includes(candidate.recipeType)) continue;

      return candidate;
    }

    return null;
  };

  const calculateRecipe = (targetId, quantity) => {
    const baseItem = itemMap[targetId];
    if (!baseItem) return null;

    const totals = {};
    totals[baseItem.id] = Number(quantity);

    let nextItem = null;
    while ((nextItem = getNextItem(totals)) !== null) {
      const operations = Math.ceil(totals[nextItem.id] / nextItem.result);
      totals[nextItem.id] -= operations * nextItem.result;

      for (const ingredient of nextItem.recipe || []) {
        const ingredientId = ingredient.value;
        if (ingredientId in totals) {
          totals[ingredientId] += operations * ingredient.amount;
        } else {
          totals[ingredientId] = operations * ingredient.amount;
        }
      }
    }

    return Object.entries(totals)
      .filter(([, value]) => value > 0)
      .map(([id, value]) => ({
        id,
        amount: value,
        name: stripColorCodes((itemMap[id] && itemMap[id].name) || id),
      }))
      .sort((left, right) => left.amount - right.amount);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const normalizedId = itemId.trim().toUpperCase();
    const parsedAmount = Number.parseInt(amount, 10);

    if (!normalizedId) {
      setError('Enter a Slimefun item ID to calculate its recipe.');
      setResults([]);
      return;
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      setError('Amount must be a whole number greater than zero.');
      setResults([]);
      return;
    }

    if (!itemMap[normalizedId]) {
      setError('That item ID was not found. Try one from the autocomplete suggestions or the Slimefun docs.');
      setResults([]);
      return;
    }

    const nextResults = calculateRecipe(normalizedId, parsedAmount);
    if (!nextResults) {
      setError('The calculator could not resolve that item.');
      setResults([]);
      return;
    }

    setResults(nextResults);
  };

  return (
    <main className="tool-page">
      <Header />

      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">Minecraft</div>
          <h1>Slimefun Item Calculator</h1>
          <p className="lede">A fork of <a href='https://github.com/Seggan/SFCalc-Online'><code>Seggan/SFCalc-Online</code></a>, with slightly better GUI. Slimefun Item Calculator helps you figure out the base ingredients needed to craft any Slimefun item. Just enter the item ID and the amount you want to craft, and the calculator will do the rest.</p>
        </div>
      </section>

      <section className="wrap tool-card">
        <div className="tool-panel">
          <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
            <div className="result-box">
              <h3>How it works</h3>
              <p>
                The calculator follows the same flow as it's Java plugin counterpart: it expands each Slimefun item into its recipe, then keeps expanding any Slimefun ingredient until only base materials remain.
              </p>
              <p>
                Item IDs are sourced from the official Slimefun docs. You can also guess the ID of an item by typing the complete item name in caps, then replace spaces with underscores. For example, the ID for "Reinforced Alloy Ingot" is <code>REINFORCED_ALLOY_INGOT</code>.
              </p>
            </div>
          </div>
          <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
            <div className="result-box">
              <h3>Notes</h3>
              <p>
                The calculator only supports base Slimefun items and DOES NOT support Slimefun addons (e.g. Supreme 2.0, Networks, Bump, etc).
              </p>
            </div>
          </div>
          <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="sf-item-id">Enter Slimefun Item ID</label>
            <input
              id="sf-item-id"
              type="search"
              list="sf-item-ids"
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
              autoComplete="off"
              placeholder="e.g. ELECTRIC_MOTOR"
            />
            <datalist id="sf-item-ids">
              {itemSuggestions.map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
            <br />
            <label htmlFor="sf-amount">Amount of Items</label>
            <input
              id="sf-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />

            <button type="submit">Calculate</button>
          </form>
         </div>

          {loading ? null : null}
          {error ? <div className="tool-error">{error}</div> : null}

          {results.length > 0 ? (
            <div className="tool-results" style={{ gridTemplateColumns: '1fr' }}>
              <div className="result-box result-box-accent">
                <h3>Required Ingredients</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px 10px' }}>Item</th>
                      <th style={{ textAlign: 'right', padding: '8px 10px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((entry) => (
                      <tr key={entry.id}>
                        <td style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>{entry.name}</td>
                        <td style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                          {entry.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}
