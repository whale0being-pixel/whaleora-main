import assert from 'node:assert/strict';
import test from 'node:test';
import { readInstagramPost } from '../lib/instagram.ts';

const image = (patch = {}) => ({
  id: '1790',
  caption: 'Keys, phone, alarm. #whaleora',
  media_type: 'IMAGE',
  media_url: 'https://scontent-bom1-1.cdninstagram.com/v/t51/photo.jpg?oe=6800',
  permalink: 'https://www.instagram.com/p/ABC123/',
  timestamp: '2026-11-10T09:30:00+0000',
  ...patch,
});

test('reads a photo post', () => {
  assert.deepEqual(readInstagramPost(image()), {
    id: '1790',
    permalink: 'https://www.instagram.com/p/ABC123/',
    image: 'https://scontent-bom1-1.cdninstagram.com/v/t51/photo.jpg?oe=6800',
    caption: 'Keys, phone, alarm. #whaleora',
    kind: 'image',
    postedAt: '2026-11-10T09:30:00+0000',
  });
});

test('a video shows its thumbnail, never the video file', () => {
  const post = readInstagramPost(image({ media_type: 'VIDEO', media_url: 'https://scontent.cdninstagram.com/v/clip.mp4', thumbnail_url: 'https://scontent.cdninstagram.com/v/cover.jpg' }));
  assert.equal(post.kind, 'video');
  assert.equal(post.image, 'https://scontent.cdninstagram.com/v/cover.jpg');
  // Copyright-flagged videos come back without a thumbnail.
  assert.equal(readInstagramPost(image({ media_type: 'VIDEO', thumbnail_url: undefined })), null);
});

test('an album that opens on a video is skipped', () => {
  assert.equal(readInstagramPost(image({ media_type: 'CAROUSEL_ALBUM' })).kind, 'carousel');
  assert.equal(readInstagramPost(image({ media_type: 'CAROUSEL_ALBUM', media_url: 'https://scontent.cdninstagram.com/v/clip.mp4?oe=1' })), null);
});

test('rejects links and images that are not plain HTTPS Instagram URLs', () => {
  assert.equal(readInstagramPost(image({ permalink: 'javascript:alert(1)' })), null);
  assert.equal(readInstagramPost(image({ permalink: 'https://instagram.com.example.net/p/1/' })), null);
  assert.equal(readInstagramPost(image({ media_url: 'http://scontent.cdninstagram.com/photo.jpg' })), null);
  assert.equal(readInstagramPost(image({ media_url: 'not a url' })), null);
});

test('rejects unknown media types and malformed entries', () => {
  assert.equal(readInstagramPost(image({ media_type: 'toString' })), null);
  assert.equal(readInstagramPost(image({ media_type: 'STORY' })), null);
  assert.equal(readInstagramPost(image({ id: 42 })), null);
  assert.equal(readInstagramPost(null), null);
  assert.equal(readInstagramPost('post'), null);
});

test('a missing caption is blank and a long one is capped', () => {
  assert.equal(readInstagramPost(image({ caption: undefined })).caption, '');
  assert.equal(readInstagramPost(image({ caption: `  ${'a'.repeat(900)}  ` })).caption.length, 500);
});
