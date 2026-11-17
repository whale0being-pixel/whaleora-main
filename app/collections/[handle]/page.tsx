import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/commerce';
import { getCatalog } from '@/lib/shopify/catalog';
import { BUNDLE_COLLECTION } from '@/lib/shopify/bundles';
import { getCollection } from '@/lib/shopify/collections';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection((await params).handle);
  if (!collection) return {};
  return { title: collection.title, description: collection.description || `${collection.title} from Whaleora.` };
}

/** A Shopify collection, shown with the site's own product cards in the store's order. */
export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  if (handle === BUNDLE_COLLECTION) redirect('/bundles');
  const [collection, catalog] = await Promise.all([getCollection(handle), getCatalog()]);
  if (!collection) notFound();

  const byHandle = new Map(catalog.flatMap((product) => product.shopify ? [[product.shopify.handle, product] as const] : []));
  const items = collection.productHandles.flatMap((productHandle) => byHandle.get(productHandle) ?? []);

  return <main className="page-main">
    <section className="collection-hero"><div className="shell collection-hero-grid">
      <div className="collection-hero-copy">
        <p className="eyebrow dark"><Link href="/products">Shop</Link> · {items.length} {items.length === 1 ? 'object' : 'objects'}</p>
        <h1>{collection.title}</h1>
        {collection.description && <p>{collection.description}</p>}
      </div>
    </div></section>

    <section className="shop-section shell section-pad">
      {items.length
        ? <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        : <div className="bundles-empty">
            <h2>Nothing here just yet.</h2>
            <p>Every object is on the shop page in the meantime.</p>
            <Link href="/products" className="button button-primary">Shop all <span aria-hidden="true"><ArrowRight size={16} strokeWidth={2} /></span></Link>
          </div>}
    </section>
  </main>;
}
