import { products as bundledProducts } from '@/data/products';
import { everydayHabits as bundledHabits, hubChecklists } from '@/data/safety-hub';
import { reviewVideos } from '@/data/review-videos';
import { starterPosts } from '@/data/blog';
import type { BlogPost, ContentDocument, HubChecklistContent, ProductEditorial, ReviewContent } from './types';

/**
 * Seed copy for the studio. The Shopify-backed fields start blank on purpose:
 * blank means "whatever the store says", so a connected Shopify is the default
 * source and an editor only fills these in to override it.
 */
export function productEditorialFromCatalog(): ProductEditorial[] {
  return bundledProducts.map((product) => ({
    id: product.id,
    title: '',
    shortDescription: '',
    longDescription: '',
    images: [],
    price: null,
    label: product.label,
    features: [...product.features],
    specifications: product.specifications.map((item) => ({ ...item })),
    howItWorks: product.howItWorks.map((item) => ({ ...item })),
    howItWorksImage: product.howItWorksImage ?? '',
    scenarios: [...product.scenarios],
    included: [...product.included],
    highlights: product.highlights.map((item) => ({ ...item })),
    compare: { ...product.compare },
  }));
}

export function defaultChecklists(): HubChecklistContent[] {
  return hubChecklists.map((item) => ({ id: item.id, title: item.title, description: item.description, items: [...item.items] }));
}

export function defaultHabits(): string[] {
  return [...bundledHabits];
}

export function defaultPosts(): BlogPost[] {
  return starterPosts.map((post) => ({ ...post }));
}

/**
 * Content saved before the Shopify-override model existed carries a copy of the
 * bundled text in every field, which would read as a deliberate override and
 * shut Shopify out. A value identical to the bundled default was never actually
 * edited, so hand it back to Shopify; anything genuinely changed is kept.
 */
function releaseUntouched(item: ProductEditorial): ProductEditorial {
  const bundled = bundledProducts.find((product) => product.id === item.id);
  if (!bundled) return item;
  const inherited = <T extends 'title' | 'shortDescription' | 'longDescription'>(key: T) => (item[key] === bundled[key] ? '' : item[key]);
  const specifications = item.specifications.map((spec) => {
    if (item.id === 'pepper-spray' && spec.label.toLowerCase() === 'range') return { ...spec, value: 'Up to 7 feet' };
    if (item.id === 'window-breaker' && spec.label.toLowerCase() === 'weight') return { ...spec, value: '92 grams' };
    if (item.id === 'sos-alarm' && spec.label.toLowerCase() === 'battery') return { ...spec, value: 'USB-C rechargeable Lithium-Ion battery' };
    return spec;
  });
  const features = item.id === 'window-breaker' ? item.features.filter((feature) => !/keyring-friendly/i.test(feature)) : item.features;
  const included = item.id === 'window-breaker' ? item.included.filter((entry) => !/keyring attachment/i.test(entry)) : item.included;
  const highlights = item.id === 'pepper-spray'
    ? item.highlights.map((highlight) => highlight.label.toLowerCase() === 'range' ? { ...highlight, value: 'Up to 7 ft' } : highlight)
    : item.id === 'window-breaker'
      ? item.highlights.map((highlight) => highlight.label.toLowerCase().includes('weight') ? { ...highlight, value: '92 g' } : highlight)
      : item.highlights;
  const longDescription = item.id === 'sos-alarm'
    ? item.longDescription.replace(/, no charging\.?/i, '. USB-C rechargeable')
    : item.id === 'pepper-spray'
      ? item.longDescription.replace(/8(?:–|-| to )10 feet/gi, 'up to 7 feet')
      : item.id === 'window-breaker' ? item.longDescription.replace(/28 grams/gi, '92 grams') : item.longDescription;
  const shortDescription = item.id === 'pepper-spray'
    ? item.shortDescription.replace(/8(?:–|-| to )10 feet/gi, 'up to 7 feet')
    : item.id === 'window-breaker' ? item.shortDescription.replace(/28 grams/gi, '92 grams') : item.shortDescription;
  const compare = item.id === 'window-breaker' ? { ...item.compare, carry: 'Glovebox or door pocket — not your keyring' } : item.compare;
  const releasedShortDescription = item.shortDescription === bundled.shortDescription ? '' : shortDescription;
  const releasedLongDescription = item.longDescription === bundled.longDescription ? '' : longDescription;
  return {
    ...item,
    features, specifications, highlights, compare, included,
    title: inherited('title'),
    shortDescription: releasedShortDescription,
    longDescription: releasedLongDescription,
    images: item.images ?? [],
    howItWorksImage: item.howItWorksImage ?? '',
    price: item.price ?? null,
  };
}

export function hydrateContent(content: ReviewContent): ReviewContent {
  const bundled = productEditorialFromCatalog();
  const edited = new Map(content.products.map((item) => [item.id, releaseUntouched(item)]));
  return {
    ...content,
    // Creator videos are real creator-shared assets; clear legacy demo flags on videos only.
    videos: content.videos.map((video) => ({ ...video, demo: false })),
    products: bundled.map((item) => edited.get(item.id) ?? item),
    checklists: content.checklists.length ? content.checklists : defaultChecklists(),
    habits: content.habits.length ? content.habits : defaultHabits(),
    posts: content.posts?.length ? content.posts : defaultPosts(),
  };
}

export const defaultContent: ReviewContent = {
  settings: { writtenTitle: 'A few words from the everyday.', writtenSubtitle: '', videoTitle: 'A closer look.\nIn motion.', videoSubtitle: 'Creator-shared videos. Tap a clip to watch.', showWritten: true, showVideos: true, marqueeSeconds: 65 },
  videos: reviewVideos.map((video) => ({ ...video, visible: true, demo: false })),
  products: productEditorialFromCatalog(),
  checklists: defaultChecklists(),
  habits: defaultHabits(),
  posts: defaultPosts(),
  testimonials: [
    { quote: 'It lives next to my keys now. I don’t have to remember to pack it separately.', name: 'Aarohi S.', detail: 'Personal SOS Alarm' },
    { quote: 'I liked that I could understand it without sitting through a tutorial.', name: 'Riya M.', detail: 'Personal SOS Alarm' },
    { quote: 'Small enough for the side pocket I actually use, not the bottom of my bag.', name: 'Meera K.', detail: 'Pepper Spray' },
    { quote: 'No charging cable. No app. Just something useful on my keyring.', name: 'Dev P.', detail: 'Survival Whistle' },
    { quote: 'We picked a spot in the car for it, and made sure everyone knew where it was.', name: 'Kabir A.', detail: 'Window Breaker' },
    { quote: 'The simple design is what made me want to carry it every day.', name: 'Sana R.', detail: 'Personal SOS Alarm' },
    { quote: 'I clipped it to my travel bag before I packed anything else.', name: 'Neha D.', detail: 'Survival Whistle' },
    { quote: 'I came for one thing. The clear product details helped me choose the right one.', name: 'Ishaan V.', detail: 'Everyday essentials' },
  ].map((review, index) => ({ ...review, id: `testimonial-${index + 1}`, row: index < 4 ? 1 : 2, visible: true, demo: true })),
};

export function initialDocument(): ContentDocument {
  return { revision: 0, draft: structuredClone(defaultContent), published: structuredClone(defaultContent), updatedAt: null, publishedAt: null };
}
