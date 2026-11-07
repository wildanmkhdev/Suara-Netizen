import { ImageResponse } from 'next/og';

export const alt = 'Suara Netizen. Pahami suara warganet.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#fff', color: '#111', padding: '64px', fontFamily: 'sans-serif', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 600 }}>Suara Netizen</div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-4px' }}>
        <span>Pahami suara</span><span>warganet.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 27, maxWidth: 930, lineHeight: 1.5 }}>Sentimen, kata yang menonjol, dan indikasi promosi dalam komentar YouTube.</div>
      <div style={{ display: 'flex', fontSize: 21, color: '#5c5c5c' }}>suara-netizen.vercel.app</div>
    </div>,
    { ...size },
  );
}
