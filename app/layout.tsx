import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Bebas_Neue } from 'next/font/google';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-ibm',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Rain or Shine',
};

export const viewport: Viewport = {
  themeColor: '#c45c3a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${bebasNeue.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='6' fill='%23c45c3a'/><g stroke='%23c45c3a' stroke-width='2' stroke-linecap='round'><line x1='16' y1='2' x2='16' y2='6'/><line x1='16' y1='26' x2='16' y2='30'/><line x1='2' y1='16' x2='6' y2='16'/><line x1='26' y1='16' x2='30' y2='16'/><line x1='6.1' y1='6.1' x2='8.9' y2='8.9'/><line x1='23.1' y1='23.1' x2='25.9' y2='25.9'/><line x1='25.9' y1='6.1' x2='23.1' y2='8.9'/><line x1='8.9' y1='23.1' x2='6.1' y2='25.9'/></g></svg>"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-ibm), monospace' }}>
        {children}
      </body>
    </html>
  );
}
