/**
 * Bundles are their own products in Shopify — kits made of the four singles,
 * sold separately. The store groups them in this collection; a "Bundle" tag
 * marks one too, in case the collection isn't published to the site's channel.
 */
export const BUNDLE_COLLECTION = 'safety-kits-bundles';

type BundleSignals = { tags: string[]; collections?: { nodes: { handle: string }[] } | null };

export const isBundle = (remote: BundleSignals) =>
  Boolean(remote.collections?.nodes.some((collection) => collection.handle === BUNDLE_COLLECTION))
  || remote.tags.some((tag) => /^(bundles?|kits?)$/i.test(tag.trim()));

/**
 * The store titles kits "Name | what's inside" — "Car Safety Kit | Window
 * Breaker + Safety Whistle" — which is two lines' worth on a card. Split there,
 * the card can lead with the name and say what's in the box underneath,
 * instead of under a paragraph of description. A title without the separator
 * comes back whole, with no detail.
 */
export function splitProductTitle(title: string): { name: string; detail: string } {
  const [name, ...rest] = title.split(/\s+\|\s+/);
  const detail = rest.join(' | ').trim();
  return name.trim() && detail ? { name: name.trim(), detail } : { name: title.trim(), detail: '' };
}

/**
 * The order kits are shown in, by the name before the "|" in their Shopify
 * title. Anything not listed — a new kit, or one renamed in Shopify — follows
 * the listed ones in the store's own order; add it here to place it.
 */
export const BUNDLE_ORDER = [
  'Everyday Safety Kit',
  'Everyday Safety Duo',
  'Everyday Duo Budget',
  'Complete Safety Set',
  'Car Safety Kit',
  'Car Safety Kit Pro',
];

const nameKey = (title: string) => splitProductTitle(title).name.toLowerCase().replace(/[^a-z0-9]+/g, '');
const BUNDLE_RANK = new Map(BUNDLE_ORDER.map((name, index) => [nameKey(name), index]));

/** Products in BUNDLE_ORDER first, in that order; everything else after, as it came. */
export const inBundleOrder = <P extends { title: string }>(items: P[]): P[] => items
  .map((item, index) => ({ item, index, rank: BUNDLE_RANK.get(nameKey(item.title)) ?? BUNDLE_ORDER.length }))
  .sort((a, b) => a.rank - b.rank || a.index - b.index)
  .map(({ item }) => item);

/** Singles are everything that isn't a bundle: the four objects the site was built around. */
export const singlesOnly = <P extends { category: string }>(catalog: P[]) => catalog.filter((product) => product.category !== 'Bundles');

/** One entry in the Shop menu. */
export type ShopMenuLink = { href: string; label: string };

/** Bundles have their own page; every other collection lives under /collections. */
export const collectionHref = (handle: string) => handle === BUNDLE_COLLECTION ? '/bundles' : `/collections/${handle}`;

/**
 * "Shop all" and then the store's collections as Shopify orders them. Without
 * a store connection, Bundles stays reachable so the menu never loses it.
 */
export function shopMenu(collections: { handle: string; title: string }[]): ShopMenuLink[] {
  const fromStore = collections.map((collection) => ({ href: collectionHref(collection.handle), label: collection.title }));
  return [
    { href: '/products', label: 'Shop all' },
    ...fromStore,
    ...(fromStore.some((link) => link.href === '/bundles') ? [] : [{ href: '/bundles', label: 'Safety Kits & Bundles' }]),
  ];
}
