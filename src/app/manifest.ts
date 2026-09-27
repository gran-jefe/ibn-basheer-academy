import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ibn Basheer Academy for Arabic & Islamic Studies | أكاديمية ابن بشير',
    short_name: 'Ibn Basheer',
    description:
      'Premier Virtual Islamic Seminary offering structured live classes in Quran, Tajweed, Classical Arabic, Fiqh, Hadith, and Islamic Sciences.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#0b1614',
    theme_color: '#094236',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    dir: 'auto',
    categories: ['education', 'books', 'religion'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    shortcuts: [
      {
        name: 'Student Portal',
        short_name: 'Portal',
        description: 'Access your halaqah schedule, live Google Meet links, and homework',
        url: '/student',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Apply & Admissions',
        short_name: 'Apply',
        description: 'Submit an online application for academic admission',
        url: '/enroll',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Courses & Texts',
        short_name: 'Courses',
        description: 'Explore classical texts and mutūn taught across the 5 levels',
        url: '/#courses',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Faculty Council',
        short_name: 'Faculty',
        description: 'Meet verified scholars with authenticated isnād',
        url: '/#faculty',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
