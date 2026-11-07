import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#070b14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Suara-Netizen AI — Radar Sentimen Publik & Filter Bot Manipulasi Digital',
  description:
    'Platform kecerdasan buatan untuk menganalisis sentimen asli publik, mendeteksi serbuan bot promosi judi online (judol) di kolom komentar, dan memperkuat literasi digital masyarakat Indonesia.',
  keywords: [
    'Suara Netizen',
    'Sentimen Analisis',
    'Deteksi Judol',
    'Judi Online',
    'Literasi Digital Indonesia',
    'Filter Bot Sosmed',
    'YouTube Comment Analyzer',
    'AI Indonesia',
  ],
  authors: [{ name: 'Suara-Netizen Initiative' }],
  creator: 'wildanmkhdev',
  metadataBase: new URL('https://suara-netizen.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://suara-netizen.vercel.app',
    siteName: 'Suara-Netizen AI',
    title: 'Suara-Netizen AI — Radar Sentimen Publik & Filter Bot Manipulasi Digital',
    description:
      'Dengarkan suara netizen asli. Saring kebisingan bot sindikat judi online dan manipulasi opini di kolom komentar media sosial.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Suara-Netizen AI Dashboard & Cyber Literacy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suara-Netizen AI — Radar Sentimen Publik & Filter Bot Manipulasi Digital',
    description:
      'Platform kecerdasan buatan untuk menganalisis sentimen asli publik dan mendeteksi serbuan bot promosi judi online di kolom komentar.',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80',
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full dark scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
