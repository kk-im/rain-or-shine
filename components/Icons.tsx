export const ICONS: Record<string, string> = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="19.78" y1="4.22" x2="17.66" y2="6.34"/><line x1="6.34" y1="17.66" x2="4.22" y2="19.78"/></svg>`,
  'partly-cloudy': `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="3"/><line x1="10" y1="3" x2="10" y2="5"/><line x1="3" y1="10" x2="5" y2="10"/><line x1="5.05" y1="5.05" x2="6.46" y2="6.46"/><path d="M13 17.5a4 4 0 0 0 0-8 4 4 0 0 0-3.5 2.1A3 3 0 1 0 10 17.5z"/></svg>`,
  cloudy: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  rain: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/></svg>`,
  storm: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`,
};

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ icon, size = 17, className = '' }: WeatherIconProps) {
  const svg = ICONS[icon] || ICONS['partly-cloudy'];
  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'inline-flex' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
