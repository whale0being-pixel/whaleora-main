import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/shopify/catalog';
import { hubChecklists } from '@/data/safety-hub';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://whaleora.com';
  const routes = ['', '/products', '/about', '/safety-hub', '/institutions', '/contact', '/warranty'];
  const catalog = await getCatalog();
  
  return [
    // 1. Static Routes
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const, priority: route === '' ? 1 : 0.8 })),
    
    // 2. Shopify Products
    ...catalog.map((product) => ({ url: `${base}/products/${product.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 })),
    
    // 3. Shopify Product Reviews
    ...catalog.map((product) => ({ url: `${base}/products/${product.slug}/reviews`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 })),
    
    // 4. Dynamic Safety Hub Protocols (Newly Added)
    ...hubChecklists.map((checklist) => ({ url: `${base}/safety-hub/${checklist.id}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}