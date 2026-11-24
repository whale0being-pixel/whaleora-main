/**
 * The home page's Instagram feed: what a post looks like once it has been read
 * off the Instagram API, and the rules for reading it.
 *
 * Deliberately import-free so both halves can share it: convex/instagram.ts
 * parses the API response with it inside Convex, and the storefront renders
 * the result.
 */

export const INSTAGRAM_HANDLE = 'whaleora.safety';
export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

/**
 * Posts the home page shows, in this order, until the live feed is connected
 * (ADMIN.md → Instagram feed). Without API access there are no cover images
 * to show, so these render through Instagram's own embedded player. Once the
 * live feed has posts, it takes over and this list goes unused.
 *
 * Paste links without the share-tracking query string Instagram adds.
 */
export const PINNED_INSTAGRAM_POSTS = [
  'https://www.instagram.com/reel/DdgNsX7h0oH/',
  'https://www.instagram.com/reel/DdzCt4fK-on/',
  'https://www.instagram.com/reel/Dev2RdwhLT1/',
  'https://www.instagram.com/reel/DfPd_T8PzSj/',
  'https://www.instagram.com/p/DeD1k-GmkH0/',
  'https://www.instagram.com/reel/DehIh6ghtfZ/',
  'https://www.instagram.com/reel/Dd6f70rhCSZ/',
] as const;

/** How many posts a sync keeps. The home page shows the newest six. */
export const INSTAGRAM_FEED_SIZE = 12;

/**
 * How old a synced feed may get before the storefront stops showing it.
 * Instagram's image URLs are signed and expire within days, so a feed that has
 * stopped syncing — a revoked token, say — gives way to the pinned posts
 * rather than lingering as a grid of broken images.
 */
export const INSTAGRAM_STALE_AFTER_MS = 2 * 24 * 60 * 60 * 1000;

export type InstagramPost = {
  id: string;
  permalink: string;
  /** The photo, a video's cover frame, or an album's first photo. */
  image: string;
  caption: string;
  kind: 'image' | 'video' | 'carousel';
  postedAt: string;
};

const CAPTION_LIMIT = 500;

const httpsUrl = (value: unknown): URL | null => {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
};

const kindOf = (mediaType: unknown): InstagramPost['kind'] | null =>
  mediaType === 'IMAGE' ? 'image' : mediaType === 'VIDEO' ? 'video' : mediaType === 'CAROUSEL_ALBUM' ? 'carousel' : null;

/**
 * One entry of `GET /me/media`, or null when it cannot be shown.
 *
 * A video is shown by its thumbnail. An album's `media_url` is its first item,
 * which is a video file when the album opens on one; an <img> cannot show that,
 * so those albums are skipped rather than rendered as a broken tile.
 */
export function readInstagramPost(item: unknown): InstagramPost | null {
  if (!item || typeof item !== 'object') return null;
  const entry = item as Record<string, unknown>;
  const kind = kindOf(entry.media_type);
  const imageSource = kind === 'video' ? entry.thumbnail_url : entry.media_url;
  const image = httpsUrl(imageSource);
  const permalink = httpsUrl(entry.permalink);
  if (!kind || !image || !permalink || typeof entry.id !== 'string' || typeof entry.timestamp !== 'string') return null;
  if (image.pathname.toLowerCase().endsWith('.mp4')) return null;
  if (permalink.hostname !== 'instagram.com' && permalink.hostname !== 'www.instagram.com') return null;
  return {
    id: entry.id,
    // The strings as Instagram sent them: the image URL is signed, and
    // re-serialising it through URL could re-encode the signature.
    permalink: entry.permalink as string,
    image: imageSource as string,
    caption: typeof entry.caption === 'string' ? entry.caption.trim().slice(0, CAPTION_LIMIT) : '',
    kind,
    postedAt: entry.timestamp,
  };
}
