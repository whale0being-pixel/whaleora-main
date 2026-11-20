import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';
import { internalAction, internalMutation, internalQuery, query, type ActionCtx } from './_generated/server';
import { instagramPost } from './schema';
import { INSTAGRAM_FEED_SIZE, readInstagramPost, type InstagramPost } from '../lib/instagram';

/**
 * The home page's Instagram feed.
 *
 * Instagram's long-lived tokens last 60 days, and refreshing one hands back a
 * new token, so the token needs somewhere writable to live — here. The
 * INSTAGRAM_ACCESS_TOKEN environment variable seeds it, a daily cron refreshes
 * it, and an hourly cron reads the latest posts into `instagramFeed`
 * (convex/crons.ts). The storefront only ever sees that table, through `feed`;
 * the token never leaves Convex.
 */

const GRAPH = 'https://graph.instagram.com';
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Refresh once a token is a week old. That leaves seven weeks of daily retries
 * before it expires, and stays clear of Instagram's rule that a token under 24
 * hours old cannot be refreshed at all.
 */
const REFRESH_AFTER_MS = 7 * DAY_MS;

/** Instagram's own explanation of a failed call. It never contains the token. */
function describeFailure(body: unknown, status: number) {
  const error = (body as { error?: { message?: unknown } } | null)?.error;
  return typeof error?.message === 'string' ? error.message : `HTTP ${status}`;
}

export const storedToken = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<'instagramToken'> | null> => ctx.db.query('instagramToken').first(),
});

/**
 * The token to call Instagram with, or null when none is configured.
 *
 * The stored token descends from the environment token it was seeded with. A
 * different environment value means someone generated a fresh token — after a
 * password change revoked the old one, say — so the stored chain is dropped in
 * favour of the new token.
 */
async function currentToken(ctx: ActionCtx) {
  const seed = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!seed) return null;
  const stored: Doc<'instagramToken'> | null = await ctx.runQuery(internal.instagram.storedToken, {});
  return stored?.seed === seed
    ? { token: stored.token, seed, refreshedAt: stored.refreshedAt }
    : { token: seed, seed, refreshedAt: null };
}

export const storeToken = internalMutation({
  args: { token: v.string(), seed: v.string(), expiresAt: v.string() },
  handler: async (ctx, args): Promise<void> => {
    const row = { ...args, refreshedAt: new Date().toISOString() };
    const found = await ctx.db.query('instagramToken').first();
    if (found) await ctx.db.replace(found._id, row);
    else await ctx.db.insert('instagramToken', row);
  },
});

export const refreshToken = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    const current = await currentToken(ctx);
    if (!current) return;
    if (current.refreshedAt && Date.now() - Date.parse(current.refreshedAt) < REFRESH_AFTER_MS) return;

    const url = new URL(`${GRAPH}/refresh_access_token`);
    url.searchParams.set('grant_type', 'ig_refresh_token');
    url.searchParams.set('access_token', current.token);
    const response = await fetch(url);
    const body: unknown = await response.json().catch(() => null);
    const refreshed = body as { access_token?: unknown; expires_in?: unknown } | null;
    if (!response.ok || typeof refreshed?.access_token !== 'string') {
      // The old token stays in use, and tomorrow's run tries again.
      console.warn(`Instagram token refresh failed: ${describeFailure(body, response.status)}`);
      return;
    }
    const expiresIn = typeof refreshed.expires_in === 'number' ? refreshed.expires_in * 1000 : 60 * DAY_MS;
    await ctx.runMutation(internal.instagram.storeToken, {
      token: refreshed.access_token,
      seed: current.seed,
      expiresAt: new Date(Date.now() + expiresIn).toISOString(),
    });
  },
});

export const storeFeed = internalMutation({
  args: { posts: v.array(instagramPost) },
  handler: async (ctx, args): Promise<void> => {
    const row = { posts: args.posts, syncedAt: new Date().toISOString() };
    const found = await ctx.db.query('instagramFeed').first();
    if (found) await ctx.db.replace(found._id, row);
    else await ctx.db.insert('instagramFeed', row);
  },
});

/** Read the latest posts from Instagram. Run by cron hourly; `npx convex run instagram:sync` runs it now. */
export const sync = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    const current = await currentToken(ctx);
    // No token configured: empty the feed, and the home page falls back to
    // its pinned posts.
    if (!current) {
      await ctx.runMutation(internal.instagram.storeFeed, { posts: [] });
      return;
    }

    const url = new URL(`${GRAPH}/me/media`);
    url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
    url.searchParams.set('limit', String(INSTAGRAM_FEED_SIZE));
    url.searchParams.set('access_token', current.token);
    const response = await fetch(url);
    const body: unknown = await response.json().catch(() => null);
    const data = (body as { data?: unknown } | null)?.data;
    if (!response.ok || !Array.isArray(data)) {
      // Keep the last good feed. The storefront stops showing it once it is
      // two days old (INSTAGRAM_STALE_AFTER_MS), before its image URLs expire.
      console.warn(`Instagram feed sync failed: ${describeFailure(body, response.status)}`);
      return;
    }
    const posts = data.flatMap((item): InstagramPost[] => {
      const post = readInstagramPost(item);
      return post ? [post] : [];
    });
    await ctx.runMutation(internal.instagram.storeFeed, { posts: posts.slice(0, INSTAGRAM_FEED_SIZE) });
  },
});

/** The posts the home page shows, and when they were read. Public: nothing here is private. */
export const feed = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db.query('instagramFeed').first();
    return row ? { posts: row.posts, syncedAt: row.syncedAt } : null;
  },
});
