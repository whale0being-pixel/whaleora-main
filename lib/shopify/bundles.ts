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
