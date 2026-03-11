'use client';
import { useState, useEffect, useCallback } from 'react';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { Hero } from '@/components/Hero';
import { ForecastStrip } from '@/components/ForecastStrip';
import { AddCityModal } from '@/components/AddCityModal';
import { Toast } from '@/components/Toast';
import { Location } from '@/lib/types';
import { DEFAULT_LOCATIONS, SOURCES, FORECAST, ICON_TO_COND, SOURCES_BY_CITY, FORECAST_BY_CITY } from '@/lib/data';
import { fmt } from '@/lib/weather';

const MOBILE_BP = 1024;

export default function Page() {
  const [locations, setLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [selectedDay, setSelectedDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= MOBILE_BP;
      setIsMobile(mobile);
      setSidebarOpen(prev => {
        // Don't auto-open on mobile, auto-open on desktop
        if (!mobile && prev === false) return true;
        return prev;
      });
    };
    check();
    // Initialize sidebar based on screen size
    setSidebarOpen(window.innerWidth > MOBILE_BP);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeLoc = locations[activeIndex];
  const citySources = (activeLoc ? SOURCES_BY_CITY[activeLoc.name] : null) || SOURCES;
  const cityForecast = (activeLoc ? FORECAST_BY_CITY[activeLoc.name] : null) || FORECAST;
  const avgTemp = Math.round(citySources.reduce((a, s) => a + s.temp, 0) / citySources.length);
  const forecast = cityForecast[selectedDay];

  const handleSelectLoc = useCallback((i: number) => {
    setActiveIndex(i);
    setSelectedDay(0);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleRemoveLoc = useCallback((i: number) => {
    if (locations.length <= 1) { setToast('Cannot remove last location'); return; }
    const name = locations[i].name;
    setLocations(prev => {
      const next = [...prev];
      next.splice(i, 1);
      return next;
    });
    setActiveIndex(prev => prev >= locations.length - 1 ? locations.length - 2 : prev);
    setToast(`${name} removed`);
  }, [locations]);

  const handleAddCity = useCallback((loc: Location) => {
    setLocations(prev => [...prev, loc]);
    setActiveIndex(locations.length); // new city index
    setModalOpen(false);
    setToast(`${loc.name} added`);
  }, [locations.length]);

  const handleSelectDay = useCallback((i: number) => {
    setSelectedDay(i);
  }, []);

  // Summary text
  const spread = Math.max(...citySources.map(s => s.temp)) - Math.min(...citySources.map(s => s.temp));
  const conf = spread <= 2 ? 'strong' : spread <= 4 ? 'moderate' : 'mixed';
  const outlook = activeLoc?.condition.match(/RAIN|STORM/)
    ? 'Expect wet conditions at some point — pack a layer and keep an umbrella close.'
    : activeLoc?.condition.match(/SUNNY|CLEAR/)
    ? 'Conditions look settled and dry. A good day to be outside early before UV peaks.'
    : 'Conditions may shift through the day. Be prepared for some variability.';
  const summaryText = activeLoc
    ? `Sources show ${conf} agreement for ${activeLoc.name} today, with a ${spread}° spread across all 6 providers. Consensus sits at ${fmt(avgTemp, unit)}°. ${outlook}`
    : '';

  const sourceAvg = avgTemp;
  const srcTemps = citySources.map(s => s.temp);
  const srcMax = Math.max(...srcTemps), srcMin = Math.min(...srcTemps);

  if (!activeLoc) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar
        locationLabel={`${activeLoc.name.toUpperCase()}, ${activeLoc.country}`}
        unit={unit}
        onUnitChange={setUnit}
        onAddCity={() => setModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar
          locations={locations}
          activeIndex={activeIndex}
          unit={unit}
          isOpen={sidebarOpen}
          isMobile={isMobile}
          onSelect={handleSelectLoc}
          onRemove={handleRemoveLoc}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Hero
            location={activeLoc}
            unit={unit}
            avgTemp={activeLoc.temp}
            selectedDay={selectedDay}
            forecastHi={forecast.hi}
            forecastLo={forecast.lo}
            forecastDay={forecast.day}
            forecastCond={ICON_TO_COND[forecast.icon] || 'PARTLY CLOUDY'}
          />

          <ForecastStrip
            forecast={cityForecast}
            selectedDay={selectedDay}
            unit={unit}
            isMobile={isMobile}
            onSelect={handleSelectDay}
          />

          {/* Content area — stacks on mobile, 2-col on desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 210px',
            flex: 1,
          }}>
            {/* Left col */}
            <div style={{
              borderRight: isMobile ? 'none' : '1px solid var(--bdr)',
              borderBottom: isMobile ? '1px solid var(--bdr)' : 'none',
              display: 'flex', flexDirection: 'column', minWidth: 0,
            }}>
              {/* Summary */}
              <div style={{
                padding: isMobile ? '20px 16px' : '36px 44px',
                borderBottom: '1px solid var(--bdr)', flexShrink: 0,
              }}>
                <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 14 }}>
                  {selectedDay === 0 ? 'Today' : "Today's Conditions"}
                </div>
                <div style={{ fontSize: isMobile ? 12 : 13, lineHeight: 1.9, color: 'var(--text)', maxWidth: 620, fontWeight: 300 }}>
                  {summaryText}
                </div>
              </div>

              {/* Sources */}
              <div style={{ padding: isMobile ? '16px' : '28px 44px 32px', flex: 1 }}>
                <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 14 }}>
                  6 Sources
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: 1, background: 'var(--bdr)',
                  border: '1px solid var(--bdr)',
                }}>
                  {citySources.map(s => {
                    const diff = s.temp - sourceAvg;
                    const diffStr = diff > 0 ? `+${diff}°` : diff < 0 ? `${diff}°` : '—';
                    const col = s.temp === srcMax ? 'var(--accent)' : s.temp === srcMin ? '#5a8aaa' : 'var(--text)';
                    return (
                      <div key={s.name} style={{ background: 'var(--bg)', padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>{s.name}</span>
                        <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: col }}>{fmt(s.temp, unit)}°</span>
                          <span style={{ fontSize: 8, color: 'var(--dim)' }}>{diffStr}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Metrics col — horizontal scroll on mobile */}
            <div style={{
              display: isMobile ? 'grid' : 'flex',
              gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
              flexDirection: isMobile ? undefined : 'column',
              padding: isMobile ? 0 : '28px 20px',
              gap: 0,
            }}>
              {[
                {
                  label: 'Precipitation',
                  val: <><span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 26 : 34, letterSpacing: 1, lineHeight: 1, color: '#5a8aaa' }}>67<span style={{ fontSize: 15, color: 'var(--dim)' }}>%</span></span></>,
                  sub: '3.2 mm today',
                  bar: { pct: 67, color: '#5a8aaa' },
                },
                {
                  label: 'UV Index',
                  val: <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 26 : 34, letterSpacing: 1, lineHeight: 1, color: 'var(--accent)' }}>11</span>,
                  sub: 'Extreme · SPF 50+',
                  bar: { pct: 92, color: 'var(--accent)' },
                },
                {
                  label: 'Wind',
                  val: <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 26 : 34, letterSpacing: 1, lineHeight: 1 }}>SW</span>,
                  sub: '22 km/h · gusts 31',
                  bar: null,
                },
                {
                  label: 'Sunrise · Sunset',
                  val: (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#e8a040' }}>06:14</span>
                      <span style={{ color: 'var(--dim)', fontSize: 10 }}>·</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#c46030' }}>18:28</span>
                    </div>
                  ),
                  sub: null,
                  bar: { pct: 62, color: 'linear-gradient(to right,#e8a040,#c46030)' },
                },
              ].map((m, i, arr) => (
                <div
                  key={m.label}
                  style={{
                    padding: isMobile ? '16px 14px' : '20px 0',
                    borderTop: !isMobile && i > 0 ? '1px solid var(--bdr)' : 'none',
                    borderRight: isMobile && i % 2 === 0 ? '1px solid var(--bdr)' : 'none',
                    borderBottom: isMobile && i < arr.length - 2 ? '1px solid var(--bdr)' : 'none',
                    minWidth: 0,
                  }}
                >
                  <div style={{ fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>
                    {m.label}
                  </div>
                  {m.val}
                  {m.sub && (
                    <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginTop: 5, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.sub}
                    </div>
                  )}
                  {m.bar && (
                    <div style={{ height: 2, background: 'var(--bdr)', borderRadius: 1, overflow: 'hidden', marginTop: 10 }}>
                      <div style={{ height: '100%', width: `${m.bar.pct}%`, background: m.bar.color, borderRadius: 1 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AddCityModal
        isOpen={modalOpen}
        unit={unit}
        existingNames={locations.map(l => l.name)}
        onAdd={handleAddCity}
        onClose={() => setModalOpen(false)}
      />

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
