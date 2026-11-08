import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: 'Suara Netizen — Pahami percakapan di YouTube dan X',
  description:
    'Baca sentimen, lihat kata yang ramai dibahas, dan kenali indikasi promosi dari komentar YouTube dan X. Laporan yang membantu memahami percakapan.',
  keywords: [
    'Suara Netizen',
    'Analisis Sentimen',
    'Komentar YouTube',
    'Komentar X',
    'Word Cloud Indonesia',
    'Indikasi Promosi',
    'Literasi Digital',
  ],
  authors: [{ name: 'Suara Netizen' }],
  creator: 'wildanmkhdev',
  metadataBase: new URL('https://suara-netizen.vercel.app'),
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://suara-netizen.vercel.app',
    siteName: 'Suara Netizen',
    title: 'Suara Netizen — Pahami percakapan di YouTube dan X',
    description: 'Baca sentimen, lihat kata yang menonjol, dan tinjau indikasi promosi dalam komentar.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Suara Netizen. Pahami suara warganet.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suara Netizen — Pahami percakapan di YouTube dan X',
    description: 'Lihat gambaran komentar YouTube dan X dengan sentimen, word cloud, dan indikasi promosi.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={bricolage.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
