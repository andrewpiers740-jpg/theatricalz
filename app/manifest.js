// app/manifest.js - Web app manifest (served at /manifest.webmanifest)
import { SITE } from '@/config/site';

export default function manifest() {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: '/',
    display: 'browser',
    background_color: '#060b1a',
    theme_color: '#0b1530',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
