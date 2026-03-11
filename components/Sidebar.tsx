'use client';
import { Location } from '@/lib/types';
import { fmt } from '@/lib/weather';
import { useEffect, useRef } from 'react';

interface SidebarProps {
  locations: Location[];
  activeIndex: number;
  unit: 'C' | 'F';
  isOpen: boolean;
  isMobile: boolean;
  onSelect: (i: number) => void;
  onRemove: (i: number) => void;
  onClose: () => void;
}

export function Sidebar({ locations, activeIndex, unit, isOpen, isMobile, onSelect, onRemove, onClose }: SidebarProps) {
  const sidebarWidth = isMobile ? '85vw' : '240px';

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, top: 44,
            background: 'rgba(0,0,0,.22)', zIndex: 199,
          }}
        />
      )}

      <aside style={{
        width: isOpen ? sidebarWidth : 0,
        flexShrink: 0,
        background: 'var(--surf)',
        borderRight: isOpen ? '1px solid var(--bdr)' : 'none',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width .22s ease',
        ...(isMobile ? {
          position: 'fixed', top: 44, left: 0,
          height: 'calc(100vh - 44px)',
          zIndex: 200,
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,.1)' : 'none',
          width: isOpen ? sidebarWidth : 0,
        } : {}),
      }}>
        <div style={{
          padding: '18px 18px 10px',
          fontSize: 8, letterSpacing: 3,
          textTransform: 'uppercase', color: 'var(--dim)',
          whiteSpace: 'nowrap',
        }}>
          Locations
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {locations.map((loc, i) => (
            <LocationItem
              key={`${loc.name}-${i}`}
              loc={loc}
              index={i}
              isActive={i === activeIndex}
              unit={unit}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

function LocationItem({ loc, index, isActive, unit, onSelect, onRemove }: {
  loc: Location; index: number; isActive: boolean;
  unit: 'C' | 'F'; onSelect: (i: number) => void; onRemove: (i: number) => void;
}) {
  const touchRef = useRef<{ startX: number; startY: number; curX: number; isHoriz: boolean; moved: boolean } | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const THRESHOLD = 72;

    const onTouchStart = (e: TouchEvent) => {
      touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, curX: 0, isHoriz: false, moved: false };
      el.style.transition = 'none';
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = touchRef.current;
      if (!t) return;
      const dx = e.touches[0].clientX - t.startX;
      const dy = e.touches[0].clientY - t.startY;
      if (!t.moved) {
        if (Math.abs(dy) > Math.abs(dx)) return;
        if (Math.abs(dx) > 6) { t.moved = true; t.isHoriz = true; }
      }
      if (!t.isHoriz) return;
      e.preventDefault();
      t.curX = Math.min(0, dx);
      el.style.transform = `translateX(${t.curX}px)`;
    };
    const onTouchEnd = () => {
      const t = touchRef.current;
      if (!t || !t.moved || !t.isHoriz) return;
      el.style.transition = 'transform .2s ease';
      if (t.curX < -THRESHOLD) {
        el.style.transform = 'translateX(-110%)';
        setTimeout(() => onRemove(index), 190);
      } else {
        el.style.transform = 'translateX(0)';
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [index, onRemove]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'var(--accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 7, letterSpacing: 2,
        textTransform: 'uppercase', userSelect: 'none',
      }}>Remove</div>
      <div
        ref={itemRef}
        onClick={() => onSelect(index)}
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(0,0,0,.05)',
          cursor: 'pointer', position: 'relative',
          background: isActive ? 'color-mix(in srgb, var(--surf) 94%, var(--accent))' : 'var(--surf)',
          willChange: 'transform',
        }}
      >
        {isActive && (
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: 2, height: '100%', background: 'var(--accent)',
          }} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{loc.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: 'var(--accent)' }}>
            {fmt(loc.temp, unit)}°
          </span>
        </div>
        <div style={{ fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>
          {loc.condition}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          style={{
            position: 'absolute', top: '50%', right: 12,
            transform: 'translateY(-50%)',
            background: 'none', border: 'none',
            color: 'var(--dim)', fontSize: 14,
            cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
