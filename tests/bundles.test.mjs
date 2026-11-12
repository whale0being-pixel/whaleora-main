import assert from 'node:assert/strict';
import test from 'node:test';
import { BUNDLE_COLLECTION, isBundle, singlesOnly } from '../lib/shopify/bundles.ts';

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
