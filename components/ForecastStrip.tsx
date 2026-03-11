'use client';
import { ForecastDay } from '@/lib/types';
import { fmt } from '@/lib/weather';
import { WeatherIcon } from './Icons';

interface ForecastStripProps {
  forecast: ForecastDay[];
  selectedDay: number;
  unit: 'C' | 'F';
  isMobile: boolean;
  onSelect: (i: number) => void;
}

export function ForecastStrip({ forecast, selectedDay, unit, isMobile, onSelect }: ForecastStripProps) {
  return (
    <div style={{
      borderBottom: '1px solid var(--bdr)',
      flexShrink: 0,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch' as any,
      scrollbarWidth: 'none' as any,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? `repeat(${forecast.length}, 1fr)`
          : `repeat(${forecast.length - 1}, 1fr) 210px`,
        minWidth: 'max-content',
        width: '100%',
      }}>
        {forecast.map((d, i) => (
          <div
            key={d.day}
            onClick={() => onSelect(i)}
            style={{
              padding: 'clamp(10px, 2vw, 18px) clamp(6px, 1.5vw, 12px)',
              borderRight: i < forecast.length - 1 ? '1px solid var(--bdr)' : 'none',
              display: 'flex', flexDirection: 'column',
              gap: 6, cursor: 'pointer',
              background: i === selectedDay
                ? 'rgba(196,92,58,.1)'
                : i === 0 ? 'rgba(196,92,58,.05)' : 'transparent',
              boxShadow: i === selectedDay ? 'inset 0 -2px 0 var(--accent)' : 'none',
              minWidth: 44,
            }}
          >
            <div style={{
              fontSize: 8, letterSpacing: 2,
              color: i === 0 ? 'var(--accent)' : 'var(--muted)',
              textTransform: 'uppercase',
            }}>
              {d.day}
            </div>
            <WeatherIcon
              icon={d.icon}
              size={17}
              className={`weather-icon-${i === 0 ? 'today' : 'normal'}`}
            />
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(14px, 2vw, 20px)',
              color: 'var(--text)', lineHeight: 1,
            }}>
              {fmt(d.hi, unit)}°
            </div>
            <div style={{ fontSize: 9, color: 'var(--dim)' }}>{fmt(d.lo, unit)}°</div>
            <div style={{ fontSize: 7, color: 'var(--muted)', letterSpacing: 1 }}>{d.rain}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
