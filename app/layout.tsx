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
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Suara-Netizen — Analisis Sentimen Publik & Filter Spam Komentar',
  description:
    'Layanan analisis sentimen publik dan pendeteksi spam komentar media sosial berbasis kecerdasan buatan untuk memperkuat literasi informasi masyarakat Indonesia.',
  keywords: [
    'Suara Netizen',
    'Sentimen Analisis',
    'Analisis Komentar YouTube',
    'Deteksi Spam',
    'Literasi Informasi',
    'Opini Publik Indonesia',
  ],
  authors: [{ name: 'Suara-Netizen' }],
  creator: 'wildanmkhdev',
  metadataBase: new URL('https://suara-netizen.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://suara-netizen.vercel.app',
    siteName: 'Suara-Netizen',
    title: 'Suara-Netizen — Analisis Sentimen Publik & Filter Spam Komentar',
    description:
      'Pahami sentimen publik nyata dan kenali pola spam di kolom komentar media sosial dengan mudah dan cepat.',
  },
  twitter: {
    card: 'summary',
    title: 'Suara-Netizen — Analisis Sentimen Publik & Filter Spam Komentar',
    description:
      'Layanan analisis sentimen publik dan pendeteksi spam komentar media sosial untuk masyarakat Indonesia.',
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
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
