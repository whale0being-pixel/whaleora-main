import { ArrowUpRight, Layers, Play } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL, PINNED_INSTAGRAM_POSTS, type InstagramPost } from '@/lib/instagram';

/** One row of six on desktop, two rows of three on tablets; phones show the first four. */
const SHOWN = 6;

const KIND_LABEL = { image: 'Photo', video: 'Video', carousel: 'Album' } as const;

/** Hashtags are noise once a caption leaves Instagram, so the overlay and alt text drop them. */
const plainCaption = (caption: string) => caption.replace(/(^|\s)#[\p{L}\p{N}_]+/gu, ' ').replace(/\s+/g, ' ').trim();

/** Cut at a word boundary, so alt text doesn't end mid-word. */
const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max / 2 ? cut.lastIndexOf(' ') : max).trimEnd()}…`;
};

/** lucide ships no brand glyphs; this is the footer's Instagram mark. */
function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** The live feed: our own tiles, built from the cover images the API hands back. */
function FeedTiles({ posts }: { posts: InstagramPost[] }) {
  return (
    <ul className="shell insta-grid">
      {posts.slice(0, SHOWN).map((post) => {
        const caption = plainCaption(post.caption);
        return (
          <li key={post.id}>
            <a className="insta-tile" href={post.permalink} target="_blank" rel="noopener noreferrer">
              {/* Not next/image: Instagram re-signs these URLs on every sync, and each new URL would be a fresh billed optimisation. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={caption ? clip(caption, 140) : `${KIND_LABEL[post.kind]} from @${INSTAGRAM_HANDLE}`}
                width={640}
                height={800}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <span className="sr-only">{` (${KIND_LABEL[post.kind].toLowerCase()} on Instagram, opens in a new tab)`}</span>
              {post.kind !== 'image' && (
                <span className="insta-kind" aria-hidden="true">
                  {post.kind === 'video' ? <Play size={16} fill="currentColor" strokeWidth={0} /> : <Layers size={16} strokeWidth={2} />}
                </span>
              )}
              {caption && <span className="insta-caption" aria-hidden="true">{caption}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The hand-picked posts, shown before the live feed is connected. Without the
 * API there are no cover images to build tiles from, so each one is
 * Instagram's own embedded player, in a strip that scrolls sideways.
 */
function PinnedEmbeds() {
  return (
    <ul className="shell insta-embeds" role="region" aria-label={`Posts from @${INSTAGRAM_HANDLE}. Scroll sideways for more.`} tabIndex={0}>
      {PINNED_INSTAGRAM_POSTS.map((permalink, index) => (
        <li key={permalink}>
          <iframe
            src={`${permalink}embed/`}
            title={`${permalink.includes('/reel/') ? 'Reel' : 'Post'} ${index + 1} from @${INSTAGRAM_HANDLE} on Instagram`}
            loading="lazy"
            scrolling="no"
            // Instagram's player runs its own scripts and opens links in new
            // tabs; it has no business navigating this page.
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </li>
      ))}
    </ul>
  );
}

export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  return (
    <section className="journey-section insta-section" id="instagram" aria-labelledby="instagram-title" data-reveal>
      <div className="shell journey-heading">
        <div>
          <p className="eyebrow">On Instagram</p>
          <h2 id="instagram-title">Out on the commute.<br /><em>Follow along.</em></h2>
        </div>
        <div className="journey-aside">
          <span className="insta-mark"><InstagramMark /></span>
          <p>
            The latest from{' '}
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a>.
            {' '}Tap a post to open it on Instagram.
          </p>
        </div>
      </div>

      {posts.length ? <FeedTiles posts={posts} /> : <PinnedEmbeds />}

      <div className="center-action">
        <a className="button button-outline" href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          Follow @{INSTAGRAM_HANDLE}
          <span aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2} /></span>
        </a>
      </div>
    </section>
  );
}
