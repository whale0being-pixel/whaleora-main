'use client';
import { usePathname } from 'next/navigation';
import { CommerceProvider, Footer, Header } from './commerce';
import { FaqBot } from './faq-bot';
import { MotionDirector } from './brand-motion';
import type { ShopMenuLink } from '@/lib/shopify/bundles';

export function SiteFrame({ children, shopLinks }: { children: React.ReactNode; shopLinks?: ShopMenuLink[] }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return children;
  return <CommerceProvider><MotionDirector /><Header shopLinks={shopLinks} />{children}<Footer /><FaqBot /></CommerceProvider>;
}
