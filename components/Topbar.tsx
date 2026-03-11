'use client';
interface TopbarProps {
  locationLabel: string;
  unit: 'C' | 'F';
  onUnitChange: (u: 'C' | 'F') => void;
  onAddCity: () => void;
  onToggleSidebar: () => void;
}
export function Topbar({ locationLabel, unit, onUnitChange, onAddCity, onToggleSidebar }: TopbarProps) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg)', borderBottom: '1px solid var(--bdr)',
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 20px', height: 44, flexShrink: 0,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none', border: 'none', color: 'var(--dim)',
          cursor: 'pointer', width: 28, height: 28,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 4, flexShrink: 0, padding: 0,
        }}
        title="Locations"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ display: 'block', width: 15, height: 1, background: 'currentColor', borderRadius: 1 }} />
        ))}
      </button>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 17, letterSpacing: 4,
        color: 'var(--text)', flexShrink: 0,
      }}>
        RAIN <span style={{ color: 'var(--accent)' }}>/</span> SHINE
      </div>

      <div style={{
        flex: 1, textAlign: 'center',
        fontSize: 9, letterSpacing: 3,
        textTransform: 'uppercase', color: 'var(--muted)',
      }} className="hidden md:block">
        {locationLabel}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          display: 'flex', border: '1px solid var(--bdr)',
          borderRadius: 4, overflow: 'hidden',
        }}>
          {(['C', 'F'] as const).map(u => (
            <button
              key={u}
              onClick={() => onUnitChange(u)}
              style={{
                background: unit === u ? 'var(--accent)' : 'none',
                border: 'none',
                borderRight: u === 'C' ? '1px solid var(--bdr)' : 'none',
                color: unit === u ? '#fff' : 'var(--muted)',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9, letterSpacing: 1,
                padding: '4px 9px', cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              °{u}
            </button>
          ))}
        </div>
        <button
          onClick={onAddCity}
          title="Add city"
          style={{
            background: 'none', border: '1px solid var(--bdr)',
            color: 'var(--muted)', fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14, width: 28, height: 28,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: 4,
          }}
        >
          +
        </button>
      </div>
    </header>
  );
}
