import { NextResponse } from 'next/server';
import { getCatalog, type CartProduct } from '@/lib/shopify/catalog';

/**
 * The products the shopping bag can suggest. A route rather than a server
 * action: Next runs a client's actions one at a time, so reading the catalogue
 * through one could hold up the cart changes queued behind it.
 *
 * Cached at the CDN by header: the Convex content read makes this route dynamic,
 * so Next's own `revalidate` has no effect here. A price up to a minute stale is
 * safe, since Shopify's answer replaces it the moment the product is added.
 */

export async function GET() {
  const catalog = await getCatalog();
  const items: CartProduct[] = catalog.map(({ id, slug, title, label, images, price, currencyCode, shopify }) => ({
    id, slug, title, label, price, currencyCode, shopify, images: images.slice(0, 1),
  }));
  return NextResponse.json(items, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
