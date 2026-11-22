import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/commerce';
import { getBundles } from '@/lib/shopify/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Safety Kits & Bundles',
  description: 'Whaleora safety essentials packed together as ready-made kits, for yourself or as a gift.',
  alternates: { canonical: '/bundles' },
};

/** Kits of the singles, sold as their own products. Sets of one item (Duo, Four-piece) stay on the product pages. */
export default async function BundlesPage() {
  const bundles = await getBundles();

  return <main className="page-main">
    <section className="collection-hero"><div className="shell collection-hero-grid">
      <div className="collection-hero-copy">
        <p className="eyebrow dark">Safety kits &amp; bundles</p>
        <h1>Ready-made kits.<br /><em>Packed together.</em></h1>
        <p>Our essentials, grouped for how you actually move around — for yourself, or as a gift for someone you worry about.</p>
      </div>
    </div></section>

    <section className="shop-section shell section-pad">
      {bundles.length
        ? <div className="product-grid">{bundles.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        : <div className="bundles-empty">
            <h2>Kits are on their way.</h2>
            <p>Until then, every object is on the shop page, and the bag shows what to add for free shipping.</p>
            <Link href="/products" className="button button-primary">Shop all four <span aria-hidden="true"><ArrowRight size={16} strokeWidth={2} /></span></Link>
          </div>}
    </section>
  </main>;
}
