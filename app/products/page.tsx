import Image from 'next/image';
import { ProductsBrowser, ShopNote } from '@/components/products-browser';
import { getCatalog } from '@/lib/shopify/catalog';
import { singlesOnly } from '@/lib/shopify/bundles';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [catalog, { category }] = await Promise.all([getCatalog(), searchParams]);
  // The heading counts the objects themselves; bundles are kits of them.
  const singles = singlesOnly(catalog).length;
  const bundles = catalog.length - singles;

  return <main className="page-main">
    <section className="collection-hero"><div className="shell collection-hero-grid">
      <div className="collection-hero-copy">
        <p className="eyebrow dark">The whole catalogue</p>
        <h1>{singles === 4 ? 'Four objects.' : `${singles} objects.`}<br /><em>{bundles ? `Plus ${bundles} ${bundles === 1 ? 'kit' : 'kits'}.` : 'Every spec listed.'}</em></h1>
        <p>Output in decibels, weight in grams, battery type, shelf life. If a number matters to your decision, it’s on the page — and so is what the thing can’t do.</p>
      </div>
      <figure className="collection-hero-visual">
        <Image src="/lifestyle/Cyclist_with_product_in_pack.jpg" fill sizes="38vw" alt="Whaleora survival whistle carried on a handbag" />
        <figcaption>Designed to be carried, not kept in a drawer.</figcaption>
      </figure>
    </div></section>

    <ProductsBrowser catalog={catalog} initialCategory={category} />
    <ShopNote />
  </main>;
}
