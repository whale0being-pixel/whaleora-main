import { ConvexHttpClient } from 'convex/browser';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export const convexUrl = () => process.env.NEXT_PUBLIC_CONVEX_URL?.trim() || '';

export function convexHttp() {
  const url = convexUrl();
  if (!url) return null;
  return new ConvexHttpClient(url);
}

/** Published customer reviews for one product. Empty when Convex is unset. */
export async function approvedReviews(productHandle: string) {
  const url = convexUrl();
  if (!url) return [];
  try {
    const rows = await fetchQuery(api.reviews.approved, { productHandle }, { url });
    // `images` is normalised rather than trusted. The types here describe the
    // functions in convex/, but the answer comes from whatever version is
    // deployed — and a git push that lands before `convex deploy` would
    // otherwise hand every review card an undefined to call .length on.
    return rows.map((row) => ({ ...row, images: row.images ?? [] }));
  } catch {
    return [];
  }
}

export type ReviewSummary = {
  count: number;
  average: number;
  spread: { value: number; count: number }[];
  photos: string[];
};

const EMPTY_SUMMARY: ReviewSummary = {
  count: 0,
  average: 0,
  spread: [5, 4, 3, 2, 1].map((value) => ({ value, count: 0 })),
  photos: [],
};

/**
 * The rating a product page prints: average, total, spread and photos.
 *
 * Counted across every published review rather than the page of 50 that
 * `approvedReviews` returns, so the number beside the title stays right once a
 * product has more reviews than fit on one page. Falls back to an empty
 * summary — which every caller renders as "no ratings yet" — when Convex is
 * unset or unreachable, the same way the review list does.
 */
export async function reviewSummary(productHandle: string): Promise<ReviewSummary> {
  const url = convexUrl();
  if (!url) return EMPTY_SUMMARY;
  try {
    return await fetchQuery(api.reviews.summary, { productHandle }, { url });
  } catch {
    return EMPTY_SUMMARY;
  }
}
