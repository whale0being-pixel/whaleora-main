import type { Metadata } from 'next';
import { Geist, Lora } from 'next/font/google';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { ConvexClientProvider } from '@/components/convex-provider';
import { SiteFrame } from '@/components/site-frame';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import './card-refinements.css';
import './review-videos.css';
import './compact-scale.css';
import './faq-bot.css';

// Lora ships as a variable font: omitting `weight` gives the full 400–700 axis
// in one file, which is what whaleora.vercel.app serves.
const display = Lora({ variable: '--font-display', subsets: ['latin'], style: ['normal', 'italic'], display: 'swap' });
const sans = Geist({ variable: '--font-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.whaleora.com'), 
  title: {
    default: 'Whaleora | Personal Safety Essentials & SOS Alarms in India',
    template: '%s | Whaleora'
  },
  description: 'Thoughtfully designed personal safety essentials for everyday peace of mind. Shop 130dB SOS alarms, pepper sprays, and window breakers. Shipping across India.',
  openGraph: {
    title: 'Whaleora | Personal Safety Essentials & SOS Alarms',
    description: 'Designed for everyday carry. Ready for unexpected moments. Whaleora makes thoughtfully designed personal safety essentials for everyday life.',
    images: [{ url: '/brand/whaleora-logo.svg', width: 1536, height: 1024, alt: 'Whaleora personal safety objects' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whaleora | Personal Safety Essentials',
    description: 'Designed for everyday carry. Ready for unexpected moments. Whaleora makes thoughtfully designed personal safety essentials for everyday life.',
    images: ['/brand/whaleora-logo.svg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // --- NEW: Comprehensive Global Brand Entity & WebSite Schema ---
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.whaleora.com/#organization',
        name: 'Whaleora',
        alternateName: 'Whale Being',
        url: 'https://www.whaleora.com',
        logo: 'https://whaleora.com/brand/whaleora-logo.svg',
        description: 'Thoughtfully designed personal safety essentials for everyday peace of mind, including SOS alarms and window breakers.',
        founder: {
          '@type': 'Person',
          name: 'Shuli Dey',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        sameAs: [
          'https://www.instagram.com/whaleora.safety',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@whaleora.com',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.whaleora.com/#website',
        url: 'https://www.whaleora.com',
        name: 'Whaleora',
        publisher: {
          '@id': 'https://www.whaleora.com/#organization',
        },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
          
          {/* --- NEW: Invisible Schema Injection --- */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          
          <ConvexClientProvider>
            <SiteFrame>{children}</SiteFrame>
          </ConvexClientProvider>
          {/* Cookieless page analytics. Sends nothing when running outside a
              Vercel deployment, so local work does not report as traffic. */}
          <Analytics />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}