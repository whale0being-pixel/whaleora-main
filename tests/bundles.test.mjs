import assert from 'node:assert/strict';
import test from 'node:test';
import { BUNDLE_COLLECTION, collectionHref, isBundle, shopMenu, inBundleOrder, singlesOnly, splitProductTitle } from '../lib/shopify/bundles.ts';

const product = (over = {}) => ({ tags: [], collections: { nodes: [] }, ...over });

test('a product in the bundles collection is a bundle', () => {
  assert.equal(isBundle(product({ collections: { nodes: [{ handle: 'safety-gifts' }, { handle: BUNDLE_COLLECTION }] } })), true);
});

test('a Bundle or Kit tag marks a bundle when the collection is not visible', () => {
  for (const tag of ['Bundle', 'bundles', ' Kit ', 'kits']) assert.equal(isBundle(product({ tags: [tag], collections: null })), true, tag);
});

test('other collections and tags that merely contain the word do not', () => {
  assert.equal(isBundle(product({ collections: { nodes: [{ handle: 'safety-gifts' }, { handle: 'campus-commute' }] } })), false);
  assert.equal(isBundle(product({ tags: ['Alarms', 'Bundle-friendly', 'Kitchen'] })), false);
  assert.equal(isBundle({ tags: [] }), false);
});

test('singlesOnly drops bundles and keeps order', () => {
  const items = [{ id: 'a', category: 'Alarms' }, { id: 'k', category: 'Bundles' }, { id: 't', category: 'Tools' }];
  assert.deepEqual(singlesOnly(items).map((item) => item.id), ['a', 't']);
});

test('the Shop menu lists Shop all, then the store collections in Shopify order', () => {
  const menu = shopMenu([
    { handle: 'frontpage', title: 'Everyday Safety Essentials' },
    { handle: BUNDLE_COLLECTION, title: 'Safety Kits & Bundles' },
    { handle: 'safety-gifts', title: 'Safety Gifts' },
  ]);
  assert.deepEqual(menu, [
    { href: '/products', label: 'Shop all' },
    { href: '/collections/frontpage', label: 'Everyday Safety Essentials' },
    { href: '/bundles', label: 'Safety Kits & Bundles' },
    { href: '/collections/safety-gifts', label: 'Safety Gifts' },
  ]);
});

test('without a store connection the Shop menu still offers bundles', () => {
  assert.deepEqual(shopMenu([]).map((link) => link.href), ['/products', '/bundles']);
  assert.equal(collectionHref('campus-commute'), '/collections/campus-commute');
});

test('a kit title splits into its name and what is inside', () => {
  assert.deepEqual(splitProductTitle('Car Safety Kit Pro | Window Breaker + Whistle + Pepper Spray'), { name: 'Car Safety Kit Pro', detail: 'Window Breaker + Whistle + Pepper Spray' });
  assert.deepEqual(splitProductTitle('A | B | C'), { name: 'A', detail: 'B | C' });
});

test('a title without a separator, or with an empty side, stays whole', () => {
  assert.deepEqual(splitProductTitle('Personal SOS Alarm'), { name: 'Personal SOS Alarm', detail: '' });
  assert.deepEqual(splitProductTitle('Salt|Pepper'), { name: 'Salt|Pepper', detail: '' });
  assert.deepEqual(splitProductTitle(' | Only the contents'), { name: '| Only the contents', detail: '' });
});

test('kits follow the agreed order, whatever order the store returns them in', () => {
  const store = [
    'Car Safety Kit Pro | Window Breaker + Whistle + Pepper Spray',
    'Car Safety Kit | Window Breaker + Safety Whistle',
    'A New Kit | Something',
    'Complete Safety Set | Whaleora 4-Product Bundle',
    'Everyday Duo Budget | Pepper Spray + Safety Whistle',
    'Everyday Safety Duo | SOS Alarm + Pepper Spray',
    'Everyday Safety Kit | SOS Alarm + Pepper Spray + Whistle',
    'Another New Kit',
  ].map((title) => ({ title }));
  assert.deepEqual(inBundleOrder(store).map((item) => item.title.split(' | ')[0]), [
    'Everyday Safety Kit', 'Everyday Safety Duo', 'Everyday Duo Budget', 'Complete Safety Set', 'Car Safety Kit', 'Car Safety Kit Pro',
    // Unlisted kits keep the store's order, after the listed ones.
    'A New Kit', 'Another New Kit',
  ]);
});
