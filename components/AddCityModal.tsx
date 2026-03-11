'use client';
import { useState, useRef, useCallback } from 'react';
import { Location } from '@/lib/types';
import { wcodeToCondition, fmt } from '@/lib/weather';

interface AddCityModalProps {
  isOpen: boolean;
  unit: 'C' | 'F';
  existingNames: string[];
  onAdd: (loc: Location) => void;
  onClose: () => void;
}

interface SearchResult extends Location {
  country_full: string;
  admin1?: string;
}

export function AddCityModal({ isOpen, unit, existingNames, onAdd, onClose }: AddCityModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    setSelected(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`,
        { mode: 'cors' }
      );
      if (!geoRes.ok) throw new Error(`Geocoding HTTP ${geoRes.status}`);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) { setError(`No cities found for "${q}"`); return; }
      const existing = new Set(existingNames.map(n => n.toLowerCase()));
      const candidates = geoData.results.filter((r: any) => !existing.has(r.name.toLowerCase())).slice(0, 5);
      if (!candidates.length) { setError('All matching cities already added'); return; }
      const weatherData = await Promise.all(candidates.map(async (r: any) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=1`;
          const wr = await fetch(url, { mode: 'cors' });
          return { geo: r, weather: wr.ok ? await wr.json() : null };
        } catch { return { geo: r, weather: null }; }
      }));
      const mapped: SearchResult[] = weatherData.map(({ geo, weather }: any) => {
        const rawT = weather?.current?.temperature_2m;
        const temp = rawT != null ? Math.round(rawT) : 20;
        const wcode = weather?.current?.weathercode ?? null;
        const ci = wcodeToCondition(wcode);
        const latS = `${Math.abs(geo.latitude).toFixed(2)}° ${geo.latitude >= 0 ? 'N' : 'S'}`;
        const lonS = `${Math.abs(geo.longitude).toFixed(2)}° ${geo.longitude >= 0 ? 'E' : 'W'}`;
        const ht = weather?.hourly?.temperature_2m || [];
        const avg2 = (arr: number[]) => arr.length ? Math.round(arr.reduce((a: number, b: number) => a + b, 0) / arr.length) : temp;
        const morn = avg2(ht.slice(6, 12)), aft = avg2(ht.slice(12, 17)), eve = avg2(ht.slice(18, 22));
        const wind = weather?.current?.windspeed_10m ? ` ${Math.round(weather.current.windspeed_10m)} km/h wind.` : '';
        const humid = weather?.current?.relative_humidity_2m ? ` Humidity ${weather.current.relative_humidity_2m}%.` : '';
        return {
          name: geo.name, country: geo.country_code || geo.country || '',
          country_full: geo.country || '', admin1: geo.admin1,
          temp, condition: ci.condition, icon: ci.icon, coords: `${latS}, ${lonS}`,
          morning: `${ci.morningDesc} Around ${fmt(morn, unit)}°.`,
          afternoon: `${ci.afternoonDesc} Afternoon temp ${fmt(aft, unit)}°.${wind}`,
          evening: `${ci.eveningDesc} Evening around ${fmt(eve, unit)}°.${humid}`,
        };
      });
      setResults(mapped);
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [existingNames, unit]);

  const handleInput = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(() => doSearch(val), 500);
  };

  const handleAdd = () => {
    if (!selected) return;
    const { country_full, admin1, ...loc } = selected;
    onAdd(loc);
    setQuery(''); setResults([]); setSelected(null);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(180,160,135,.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        background: 'var(--surf)',
        border: '1px solid var(--bdr)',
        width: 'min(400px, 95vw)',
        borderRadius: 8, overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--bdr)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          <span>Add Location</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              value={query}
              onChange={e => handleInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(query); if (e.key === 'Escape') onClose(); }}
              placeholder="Any city in the world…"
              style={{
                flex: 1, background: 'var(--bg)',
                border: '1px solid var(--bdr)',
                color: 'var(--text)',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13, letterSpacing: 1,
                padding: '10px 14px', outline: 'none',
                borderRadius: 4,
              }}
            />
            <button
              onClick={() => doSearch(query)}
              disabled={loading}
              style={{
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9, letterSpacing: 2,
                padding: '10px 16px', cursor: 'pointer',
                textTransform: 'uppercase',
                borderRadius: 4, opacity: loading ? 0.4 : 1,
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
          <div style={{ fontSize: 8, letterSpacing: 1, color: 'var(--dim)', marginTop: 8 }}>
            Powered by open geocoding + live weather
          </div>

          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 240, overflowY: 'auto' }}>
            {loading && <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '12px 0', textAlign: 'center' }}>Searching…</div>}
            {error && <div style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', padding: '12px 0', textAlign: 'center' }}>{error}</div>}
            {results.map((r, i) => (
              <div
                key={i}
                onClick={() => setSelected(r)}
                style={{
                  padding: '10px 14px',
                  border: `1px solid ${selected === r ? 'var(--accent)' : 'var(--bdr)'}`,
                  background: selected === r ? 'rgba(196,92,58,.08)' : 'transparent',
                  cursor: 'pointer', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  borderRadius: 4,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{r.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2 }}>
                    {[r.country_full, r.admin1].filter(Boolean).join(', ')} · {r.coords}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--accent)', marginTop: 1 }}>{r.condition}</div>
                </div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'var(--accent)', flexShrink: 0, marginLeft: 12 }}>
                  {fmt(r.temp, unit)}°
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--bdr)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--muted)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: 2, padding: '7px 14px', cursor: 'pointer', textTransform: 'uppercase', borderRadius: 4 }}>
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selected}
            style={{ background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: 2, padding: '7px 14px', cursor: selected ? 'pointer' : 'not-allowed', textTransform: 'uppercase', borderRadius: 4, opacity: selected ? 1 : 0.5 }}
          >
            Add Place
          </button>
        </div>
      </div>
    </div>
  );
}
