import { ArrowUpRight, Layers, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { Stars } from '@/components/review-rating';
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL, PINNED_INSTAGRAM_POSTS, type InstagramPost } from '@/lib/instagram';

/** The live feed's newest posts; the strip scrolls sideways, so this is about page weight, not room. */
const SHOWN = 8;

const KIND_LABEL = { image: 'Photo', video: 'Video', carousel: 'Album' } as const;

/** Hashtags are noise once a caption leaves Instagram, so the cards and alt text drop them. */
const plainCaption = (caption: string) => caption.replace(/(^|\s)#[\p{L}\p{N}_]+/gu, ' ').replace(/\s+/g, ' ').trim();

/** Cut at a word boundary, so alt text doesn't end mid-word. */
const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max / 2 ? cut.lastIndexOf(' ') : max).trimEnd()}…`;
};

/**
 * A caption split the way the cards show it: its first sentence as the bold
 * title, the rest as the teaser under it.
 */
const splitCaption = (caption: string) => {
  const match = caption.match(/^(.{8,90}?[.!?])\s+(.+)$/u);
  return match ? { title: match[1], text: match[2] } : { title: clip(caption, 90), text: '' };
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

/** The caption panel under every card: bold title, optional stars, a one-line teaser and "more". */
function ReelCaption({ title, text, rating, more }: { title: string; text: string; rating?: number; more: ReactNode }) {
  return (
    <div className="reel-caption">
      <div className="reel-caption-head">
        <p className="reel-title">{title}</p>
        {rating ? <Stars value={rating} className="reel-stars" /> : null}
      </div>
      <p className="reel-teaser">
        <span>{text}</span>
        {more}
      </p>
    </div>
  );
}

function ReelStrip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul className="reel-strip" role="region" aria-label={label} tabIndex={0}>
      {children}
    </ul>
  );
}

/** The live feed: our own cards, built from the cover images the API hands back. */
function FeedTiles({ posts }: { posts: InstagramPost[] }) {
  return (
    <ReelStrip label={`Latest posts from @${INSTAGRAM_HANDLE}. Scroll sideways for more.`}>
      {posts.slice(0, SHOWN).map((post) => {
        const caption = plainCaption(post.caption);
        const { title, text } = caption ? splitCaption(caption) : { title: `@${INSTAGRAM_HANDLE}`, text: '' };
        return (
          <li key={post.id} className="reel-card">
            <a className="reel-link" href={post.permalink} target="_blank" rel="noopener noreferrer">
              <span className="reel-media">
                {/* Not next/image: Instagram re-signs these URLs on every sync, and each new URL would be a fresh billed optimisation. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={caption ? clip(caption, 140) : `${KIND_LABEL[post.kind]} from @${INSTAGRAM_HANDLE}`}
                  width={640}
                  height={1138}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                {post.kind !== 'image' && (
                  <span className="reel-kind" aria-hidden="true">
                    {post.kind === 'video' ? <Play size={18} fill="currentColor" strokeWidth={0} /> : <Layers size={16} strokeWidth={2} />}
                  </span>
                )}
              </span>
              <span className="sr-only">{` (${KIND_LABEL[post.kind].toLowerCase()} on Instagram, opens in a new tab)`}</span>
              <ReelCaption title={title} text={text || 'Watch on Instagram'} more={<span className="reel-more" aria-hidden="true">...more</span>} />
            </a>
          </li>
        );
      })}
    </ReelStrip>
  );
}

/**
 * The hand-picked posts, shown before the live feed is connected. Without the
 * API there are no cover images to build cards from, so each card's picture is
 * Instagram's own embedded player, cropped to just the video.
 */
function PinnedEmbeds() {
  return (
    <ReelStrip label={`Reels from @${INSTAGRAM_HANDLE}. Scroll sideways for more.`}>
      {PINNED_INSTAGRAM_POSTS.map((post, index) => {
        const kind = post.url.includes('/reel/') ? 'Reel' : 'Post';
        return (
          <li key={post.url} className="reel-card">
            <div className="reel-media reel-embed">
              <iframe
                src={`${post.url}embed/`}
                title={`${kind} ${index + 1} from @${INSTAGRAM_HANDLE} on Instagram`}
                loading="lazy"
                scrolling="no"
                // Instagram's player runs its own scripts and opens links in new
                // tabs; it has no business navigating this page.
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
            <ReelCaption
              title={post.title ?? `@${INSTAGRAM_HANDLE}`}
              text={post.text ?? `Watch the full ${kind.toLowerCase()} on Instagram`}
              rating={post.rating}
              more={
                <a className="reel-more" href={post.url} target="_blank" rel="noopener noreferrer">
                  ...more<span className="sr-only">{` — open ${kind.toLowerCase()} ${index + 1} on Instagram (new tab)`}</span>
                </a>
              }
            />
          </li>
        );
      })}
    </ReelStrip>
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
