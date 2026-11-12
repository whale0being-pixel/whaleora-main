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
