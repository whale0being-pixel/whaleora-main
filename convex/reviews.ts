import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { normalizeEmail } from './orders';
import { screenReview } from './reviewFilter';

const MAX_BODY = 1200;
const MAX_NAME = 80;
const MAX_IMAGES = 4;

/**
 * The only URLs a review photo may be. Mirrors REVIEW_IMAGE_HOSTS in
 * lib/images.ts, which next.config.ts hands to the image optimiser — Convex
 * bundles on its own, so the pair is kept in step by hand.
 *
 * Without it this mutation, which anyone holding the deployment URL can call,
 * would put an arbitrary attacker-chosen URL inside an <img> on a product page.
 */
const IMAGE_URL = /^https:\/\/(?:[a-z0-9-]+\.ufs\.sh|utfs\.io)\/f\/[A-Za-z0-9._-]{8,256}$/;

const cleanImages = (images: string[] | undefined) =>
  (images ?? []).map((url) => url.trim()).filter((url) => IMAGE_URL.test(url)).slice(0, MAX_IMAGES);

function assertAdmin(secret: string) {
  const expected = process.env.ORDERS_INGEST_SECRET;
  if (!expected || secret !== expected) throw new Error('Unauthorized.');
}

/** Public: approved reviews for one product, newest first. */
export const approved = query({
  args: { productHandle: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('reviews')
      .withIndex('by_product_status', (q) => q.eq('productHandle', args.productHandle).eq('status', 'published'))
      .order('desc')
      .take(50);
    // Email is collected for moderation and buyer matching, never returned.
    return rows.map((row) => ({
      id: row._id,
      rating: row.rating,
      name: row.name,
      body: row.body,
      images: row.images ?? [],
      verifiedBuyer: row.verifiedBuyer,
      submittedAt: row.submittedAt,
    }));
  },
});

/**
 * Public: the rating a product page prints beside its title — the average, the
 * total, the 5-to-1 spread behind it, and the newest customer photos.
 *
 * Separate from `approved` because that one returns a page of 50 reviews, and
 * an average taken over a page is not the product's average. This counts every
 * published review, and returns numbers rather than rows.
 */
export const summary = query({
  args: { productHandle: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('reviews')
      .withIndex('by_product_status', (q) => q.eq('productHandle', args.productHandle).eq('status', 'published'))
      .collect();
    const spread = [0, 0, 0, 0, 0];
    let total = 0;
    for (const row of rows) {
      const rating = Math.min(5, Math.max(1, Math.round(row.rating)));
      spread[rating - 1] += 1;
      total += rating;
    }
    return {
      count: rows.length,
      average: rows.length ? total / rows.length : 0,
      // Highest rating first, the order a rating breakdown is read in.
      spread: [5, 4, 3, 2, 1].map((value) => ({ value, count: spread[value - 1] })),
      // Newest first, and capped: the strip shows five and its viewer pages
      // through the rest, so the cap is what "+N" on the last tile promises.
      photos: [...rows].reverse().flatMap((row) => row.images ?? []).slice(0, 24),
    };
  },
});

export const submit = mutation({
  args: {
    productHandle: v.string(),
    rating: v.number(),
    name: v.string(),
    email: v.string(),
    body: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const rating = Math.round(args.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) throw new Error('Choose a rating from 1 to 5.');
    const name = args.name.trim().slice(0, MAX_NAME);
    const body = args.body.trim().slice(0, MAX_BODY);
    const email = args.email.trim();
    if (!name || !body) throw new Error('Add your name and a few words.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('That email address does not look right.');

    const emailNormalized = normalizeEmail(email);
    const images = cleanImages(args.images);

    // One review per product per email, so a refresh cannot post twice.
    const existing = await ctx.db
      .query('reviews')
      .withIndex('by_product_status', (q) => q.eq('productHandle', args.productHandle))
      .filter((q) => q.eq(q.field('emailNormalized'), emailNormalized))
      .first();
    if (existing) return { ok: false as const, reason: 'already-reviewed' };

    const order = await ctx.db
      .query('orders')
      .withIndex('by_email', (q) => q.eq('emailNormalized', emailNormalized))
      .first();

    // Publishes immediately unless the abuse/spam filter objects. Criticism of
    // the product is never a reason to hold a review.
    const verdict = screenReview(`${name}\n${body}`);
    await ctx.db.insert('reviews', {
      productHandle: args.productHandle,
      rating,
      name,
      email,
      emailNormalized,
      body,
      images,
      status: verdict.blocked ? 'held' : 'published',
      heldReason: verdict.reason,
      verifiedBuyer: Boolean(order),
      submittedAt: new Date().toISOString(),
    });
    return { ok: true as const, held: verdict.blocked, verifiedBuyer: Boolean(order) };
  },
});

/** Moderation queue. Guarded by the same shared secret the order ingest uses. */
export const queue = query({
  args: { secret: v.string(), status: v.optional(v.union(v.literal('published'), v.literal('held'), v.literal('removed'))) },
  handler: async (ctx, args) => {
    assertAdmin(args.secret);
    const status = args.status ?? 'held';
    const rows = await ctx.db
      .query('reviews')
      .withIndex('by_status', (q) => q.eq('status', status))
      .order('desc')
      .take(100);
    return rows.map((row) => ({
      id: row._id,
      productHandle: row.productHandle,
      rating: row.rating,
      name: row.name,
      email: row.email,
      body: row.body,
      images: row.images ?? [],
      status: row.status,
      heldReason: row.heldReason,
      verifiedBuyer: row.verifiedBuyer,
      submittedAt: row.submittedAt,
    }));
  },
});

export const moderate = mutation({
  args: {
    secret: v.string(),
    id: v.id('reviews'),
    status: v.union(v.literal('published'), v.literal('removed')),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.secret);
    await ctx.db.patch(args.id, { status: args.status, heldReason: undefined });
    return { ok: true as const };
  },
});

