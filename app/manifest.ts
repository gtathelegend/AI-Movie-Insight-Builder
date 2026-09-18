import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'POP — AI Movie Insights',
    short_name: 'POP',
    description: 'AI-powered movie insights, ratings and real audience reviews.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#e50914',
    icons: [
      {
        src: '/pop-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pop-social.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
