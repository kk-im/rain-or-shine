'use client';
import { Location } from '@/lib/types';
import { fmt } from '@/lib/weather';

interface HeroProps {
  location: Location;
  unit: 'C' | 'F';
  avgTemp: number;
  selectedDay: number;
  forecastHi: number;
  forecastLo: number;
  forecastDay: string;
  forecastCond: string;
}

export function Hero({ location, unit, avgTemp, selectedDay, forecastHi, forecastLo, forecastDay, forecastCond }: HeroProps) {
  const isToday = selectedDay === 0;
  const displayTemp = isToday ? avgTemp : forecastHi;
  const cond = isToday ? location.condition : forecastCond;
  const locLabel = isToday
    ? `${location.name.toUpperCase()}, ${location.country}`
    : `${location.name.toUpperCase()}, ${location.country} — ${forecastDay}`;

  return (
    <div style={{
      padding: 'clamp(20px, 4vw, 48px) clamp(16px, 5vw, 52px)',
      borderBottom: '1px solid var(--bdr)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(72px, 13vw, 156px)',
          letterSpacing: -4, lineHeight: .88,
          color: 'var(--text)',
        }}>
          {fmt(displayTemp, unit)}
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(22px, 4vw, 50px)',
          color: 'var(--muted)', marginTop: 10, marginLeft: 5,
        }}>
          {unit === 'C' ? '°C' : '°F'}
        </div>
      </div>

      <div style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)', marginTop: 12 }}>
        {cond}
      </div>
      <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 5 }}>
        {locLabel}
      </div>

      <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 40px)', marginTop: 'clamp(20px, 3vw, 36px)', flexWrap: 'wrap' }}>
        {[
          { label: 'Feels like', value: isToday ? `${fmt(38, unit)}°` : `${fmt(forecastLo, unit)}°`, cls: 'hot' },
          { label: 'Humidity', value: '84%', cls: 'ok' },
          { label: 'Wind', value: '22 km/h', cls: 'cool' },
          { label: 'UV Index', value: '11', cls: 'hot' },
        ].map(stat => (
          <div key={stat.label}>
            <div style={{ fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(16px, 3vw, 22px)', letterSpacing: 1,
              color: stat.cls === 'hot' ? 'var(--accent)' : stat.cls === 'cool' ? '#5a8aaa' : '#5a876a',
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
