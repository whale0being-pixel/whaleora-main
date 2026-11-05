import { NextResponse } from 'next/server';
import { getCatalog, type CartProduct } from '@/lib/shopify/catalog';

/**
 * The products the shopping bag can suggest. A route rather than a server
 * action: Next runs a client's actions one at a time, so reading the catalogue
 * through one could hold up the cart changes queued behind it.
 */
export const revalidate = 60;

export async function GET() {
  const catalog = await getCatalog();
  const items: CartProduct[] = catalog.map(({ id, slug, title, label, images, price, currencyCode, shopify }) => ({
    id, slug, title, label, price, currencyCode, shopify, images: images.slice(0, 1),
  }));
  return NextResponse.json(items);
}
