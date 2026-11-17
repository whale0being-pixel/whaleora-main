import { isShopifyConfigured, safely, shopifyFetch, SHOPIFY_PRODUCTS_TAG } from './client';
export { collectionHref, shopMenu, type ShopMenuLink } from './bundles';

/** A collection as the store lists it, with the handles of the products in it. */
export type StoreCollection = {
  handle: string;
  title: string;
  description: string;
  productHandles: string[];
};

const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections {
    collections(first: 50) {
      nodes {
        handle
        title
        description
        products(first: 100) { nodes { handle } }
      }
    }
  }
`;

type CollectionsResponse = {
  collections: { nodes: { handle: string; title: string; description: string; products: { nodes: { handle: string }[] } }[] };
};

/** Every collection published to the site's sales channel, in the store's own order. */
export async function getCollections(): Promise<StoreCollection[]> {
  if (!isShopifyConfigured()) return [];
  const data = await safely(
    () => shopifyFetch<CollectionsResponse>({ query: COLLECTIONS_QUERY, revalidate: 60, tags: [SHOPIFY_PRODUCTS_TAG] }),
    'collections fetch failed — the Shop menu falls back to its fixed links',
  );
  return (data?.collections.nodes ?? []).map((node) => ({
    handle: node.handle,
    title: node.title,
    description: node.description.trim(),
    productHandles: node.products.nodes.map((product) => product.handle),
  }));
}

export async function getCollection(handle: string): Promise<StoreCollection | undefined> {
  return (await getCollections()).find((collection) => collection.handle === handle);
}
