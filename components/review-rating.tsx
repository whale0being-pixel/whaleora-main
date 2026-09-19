import Link from 'next/link';
import { ReviewPhotos } from '@/components/review-photos';
import type { ReviewSummary } from '@/lib/convex';

/**
 * A star rating, including the fractional ones an average produces.
 *
 * Two stacked rows of the same five characters — a grey track and a coloured
 * overlay clipped to the score — so 4.8 draws as four and four-fifths stars
 * rather than rounding to five. Screen readers get the number, once.
 */
export function Stars({ value, out = 5, className = '' }: { value: number; out?: number; className?: string }) {
  const filled = Math.max(0, Math.min(out, value));
  return <span className={`star-bar ${className}`.trim()} role="img" aria-label={`${Number.isInteger(filled) ? filled : filled.toFixed(1)} out of ${out}`}>
    <span aria-hidden="true">{'★'.repeat(out)}</span>
    <span aria-hidden="true" style={{ width: `${(filled / out) * 100}%` }}><span>{'★'.repeat(out)}</span></span>
  </span>;
}

/**
 * The compact rating that sits under a product title: stars, the average and
 * the review count, jumping to the reviews further down the page.
 *
 * Renders nothing at all until a product has a rating. A "0.0 (0 reviews)"
 * badge on a new product reads as a bad product rather than a new one.
 */
export function RatingBadge({ summary, href }: { summary: ReviewSummary; href: string }) {
  if (!summary.count) return null;
  return <Link className="pdp-rating-badge" href={href}>
    <Stars value={summary.average} />
    <strong>{summary.average.toFixed(1)}</strong>
    <span>{summary.count} {summary.count === 1 ? 'review' : 'reviews'}</span>
  </Link>;
}

/**
 * The full rating panel above a product's reviews: the average, the 5-to-1
 * spread behind it, customer photos, and the way in to writing one.
 *
 * Only customer ratings feed it. The editorial quotes a product page also
 * carries have no rating, so counting them would move a number that is meant
 * to mean "what buyers scored this".
 */
export function RatingSummary({ summary, writeHref }: { summary: ReviewSummary; writeHref: string }) {
  const { count, average, spread, photos } = summary;
  return <div className={`pdp-rating-summary ${photos.length ? '' : 'without-photos'}`.trim()}>
    <div className="pdp-rating-score">
      {count ? <>
        <div className="pdp-rating-score-top">
          <strong>{average.toFixed(1)}</strong>
          <div><Stars value={average} className="star-bar-lg" /><span>{count} {count === 1 ? 'review' : 'reviews'}</span></div>
        </div>
        <ul className="pdp-rating-spread">
          {spread.map((row) => <li key={row.value}>
            <span>{row.value} <i aria-hidden="true">★</i></span>
            <span className="pdp-rating-bar"><i style={{ width: `${count ? (row.count / count) * 100 : 0}%` }} /></span>
            <span>{row.count}</span>
          </li>)}
        </ul>
      </> : <div className="pdp-rating-none">
        <strong>No ratings yet</strong>
        <p>Bought this one? Your review would be the first, and the next person reads it.</p>
      </div>}
    </div>
    <ReviewPhotos photos={photos} />
    <div className="pdp-rating-cta"><Link className="button button-primary" href={writeHref}>Write a review</Link></div>
  </div>;
}
