import type { Metadata } from 'next';
import { ProductImage } from '@/components/product-image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ProductReviewRail } from '@/components/product-detail';
import { ReviewForm } from '@/components/review-form';
import { ReviewPhotos } from '@/components/review-photos';
import { Stars } from '@/components/review-rating';
import { uploadsConfigured } from '@/app/api/uploadthing/core';
import { publishedContent } from '@/lib/content/store';
import { productReviews } from '@/lib/content/product-reviews';
import { productRating } from '@/lib/convex';
import { formatPrice, PRODUCT_IMAGE_FALLBACK } from '@/data/products';
import { getCatalog, getCatalogProduct } from '@/lib/shopify/catalog';
import '../product-page.css';
import './reviews-page.css';

export const dynamic = 'force-dynamic';

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('');

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return {};
  const title = `${product.title} reviews | Whaleora`;
  const description = `What customers say about the ${product.title}, and a place to write your own review.`;
  return { title, description, openGraph: { title, description, images: [{ url: product.images[0] || PRODUCT_IMAGE_FALLBACK }] } };
}

export default async function ProductReviewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [catalog, content] = await Promise.all([getCatalog(), publishedContent()]);
  const product = catalog.find((item) => item.slug === slug);
  if (!product) notFound();
  const { quotes, videos } = productReviews(content, product);
  const handle = product.shopify?.handle ?? product.slug;
  // The rating counts every published review; `written` is the page of 50 shown below it.
  const { written, rating } = await productRating(handle);
  const total = written.length + quotes.length;

  // --- NEW: AI & SEO Reviews and Video Schema ---
// --- NEW: AI & SEO Reviews and Video Schema ---
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  image: product.images[0] || PRODUCT_IMAGE_FALLBACK,
  description: product.shortDescription,
  brand: {
    '@type': 'Brand',
    name: 'Whaleora',
  },
  // 1. Inject the Aggregate Gold Star Rating
  ...(rating.count > 0 && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.average,
      reviewCount: rating.count,
    },
  }),
  // 2. Loop through written reviews and non-demo quotes
  review: [
    ...written.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      datePublished: new Date(r.submittedAt).toISOString().split('T')[0],
      reviewBody: r.body,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    })),
    ...quotes.filter(q => !q.demo).map((q) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: q.name },
      reviewBody: q.quote,
      reviewRating: { '@type': 'Rating', ratingValue: 5 }, // Assume featured quotes are top-tier
    })),
  ],
  // 3. Loop through product videos for Google's Video Tab (TypeScript Error Fixed)
  ...(videos.length > 0 && {
    subjectOf: videos.map((v: any) => ({
      '@type': 'VideoObject',
      name: `${product.title} Customer Review Video`,
      description: `Watch a real customer demonstration and review of the ${product.title} by Whaleora.`,
      thumbnailUrl: product.images[0] || PRODUCT_IMAGE_FALLBACK,
      contentUrl: v.src || v.url || `https://www.whaleora.com/products/${product.slug}/reviews`,
      uploadDate: new Date().toISOString().split('T')[0],
    })),
  }),
};

  return <main className="page-main pdp-reference reviews-page">
    {/* --- NEW: Invisible Schema Injection --- */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    
    <nav className="pdp-breadcrumb shell" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span>/</span>
      <Link href="/products">Shop</Link><span>/</span>
      <Link href={`/products/${product.slug}`}>{product.title}</Link><span>/</span>
      <span aria-current="page">Reviews</span>
    </nav>

    <section className="shell reviews-head">
      <div className="reviews-head-copy">
        <p className="eyebrow dark">Reviews · {product.title}</p>
        <h1>A few words from everyday life.</h1>
        <p className="reviews-head-note">Every published review is written by someone who bought this product. We publish them as they come, good or bad.</p>
        <div className="reviews-head-actions">
          <a className="button button-primary" href="#write">Write a review <span aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2} /></span></a>
          <Link className="icon-link reviews-back" href={`/products/${product.slug}`}><ArrowLeft size={15} strokeWidth={2} aria-hidden="true" /> Back to the {product.title}</Link>
        </div>
      </div>

      <aside className="reviews-summary" aria-label="Rating summary">
        <Link href={`/products/${product.slug}`} className="reviews-summary-product">
          <span className="reviews-summary-image"><ProductImage src={product.images[0] || PRODUCT_IMAGE_FALLBACK} alt={product.title} fill sizes="72px" /></span>
          <span><strong>{product.title}</strong><span>{formatPrice(product.price, product.currencyCode)}</span></span>
        </Link>
        {rating.count ? <>
          <div className="reviews-average">
            <strong>{rating.average.toFixed(1)}</strong>
            <div>
              <Stars value={rating.average} className="star-bar-lg" />
              <span>{rating.count} customer {rating.count === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>
          <ul className="reviews-spread">
            {rating.spread.map((row) => <li key={row.value}>
              <span>{row.value}★</span>
              <span className="reviews-bar"><i style={{ width: `${(row.count / rating.count) * 100}%` }} /></span>
              <span>{row.count}</span>
            </li>)}
          </ul>
          {rating.photos.length > 0 && <div className="reviews-summary-photos"><ReviewPhotos photos={rating.photos} /></div>}
        </> : <p className="reviews-summary-empty">No customer ratings yet. Yours would be the first.</p>}
      </aside>
    </section>

    {videos.length > 0 && <div className="shell pdp-section reviews-videos"><ProductReviewRail items={videos} /></div>}

    <section className="shell pdp-section reviews-list-section" aria-labelledby="all-reviews-title">
      <div className="pdp-reviews-heading">
        <h2 id="all-reviews-title">{total ? `All ${total} ${total === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}</h2>
        {total > 0 && <span>Newest first</span>}
      </div>
      {quotes.some((item) => item.demo) && <p className="pdp-reviews-disclosure">Reviews marked “Demo” are sample content, not customer feedback.</p>}

      {total ? <div className="reviews-list">
        {written.map((review) => <figure className="reviews-card" key={review.id}>
          <div className="reviews-card-top">
            <Stars value={review.rating} />
            <time dateTime={review.submittedAt}>{new Date(review.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
          </div>
          <blockquote>“{review.body}”</blockquote>
          {review.images.length > 0 && <ReviewPhotos photos={review.images} heading={null} compact />}
          <figcaption>
            <span className="pdp-review-initials" aria-hidden="true">{initials(review.name)}</span>
            <span><strong>{review.name}</strong><span>{product.title}</span></span>
            {review.verifiedBuyer && <small className="is-verified">Verified buyer</small>}
          </figcaption>
        </figure>)}
        {quotes.map((review) => <figure className="reviews-card" key={review.id}>
          <blockquote>“{review.quote}”</blockquote>
          <figcaption>
            <span className="pdp-review-initials" aria-hidden="true">{initials(review.name)}</span>
            <span><strong>{review.name}</strong><span>{product.title}</span></span>
            {review.demo && <small>Demo</small>}
          </figcaption>
        </figure>)}
      </div> : <p className="pdp-reviews-empty">No written reviews for this product yet. Be the first.</p>}
    </section>

    <section className="shell pdp-section reviews-write" id="write" aria-labelledby="write-review-title">
      <div className="pdp-section-heading"><p className="eyebrow dark">Your turn</p><h2 id="write-review-title">Tell the next person what it is like.</h2><p>A couple of lines about how you used it, and how it held up, is plenty.</p></div>
      <ReviewForm productHandle={handle} productTitle={product.title} defaultOpen photosEnabled={uploadsConfigured()} />
    </section>
  </main>;
}