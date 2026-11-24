export type Product = {
  id: string;
  slug: string;
  title: string;
  /** Product handle in Shopify admin. Defaults to `slug` when omitted. */
  shopifyHandle?: string;
  /** Bundles only ever come from Shopify; the bundled records here are all singles. */
  category: 'Alarms' | 'Tools' | 'Bundles';
  label: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  /** ISO currency for `price`. Shopify overrides this when the store is connected. */
  currencyCode?: string;
  /**
   * Catalogue photography, and the only images here the connected store
   * overrides — the gallery and every product card show Shopify's photos when
   * there are any, so merchandising stays a Shopify job. Everything else on a
   * product page is bundled art that ships with the site.
   */
  images: string[];
  features: string[];
  specifications: { label: string; value: string }[];
  howItWorks: { title: string; text: string }[];
  /**
   * The annotated photo beside the how-to-use steps. Always a bundled asset:
   * see the note on `images` for why this one never comes from the store.
   * Falls back to the second bundled photo, then the first.
   */
  howItWorksImage?: string;
  scenarios: string[];
  included: string[];
  accent: string;
  /** Three headline figures for the 3D studio. */
  highlights: { value: string; label: string }[];
  /** Plain-language row data for the side-by-side chooser. */
  compare: {
    /** The one job it does. */
    job: string;
    /** When you'd actually reach for it. */
    reachFor: string;
    /** What powers it, if anything. */
    power: string;
    /** Where it lives when you're not using it. */
    carry: string;
    /** The honest caveat. */
    caveat: string;
  };
};

export const products: Product[] = [
  {
    id: 'sos-alarm',
    slug: 'sos-alarm',
    title: 'Personal SOS Alarm',
    category: 'Alarms',
    label: 'Acoustic defence',
    shortDescription: 'Pull the pin: 130dB siren and a strobe, until you put the pin back.',
    longDescription: 'Pull the pin and it does two things at once — a 130dB dual-siren and a strobe light. Push the pin back in and it stops. USB-C rechargeable, with no app or pairing required.',
    price: 1699,
    images: ['/products/B0HK12PJHY Secondary 7.jpg', '/lifestyle/sosinhand.jpeg'],
    howItWorksImage: '/products/158A9620.jpg',
    features: ['Pull-pin activation', 'Compact keychain format', 'Built-in strobe light', 'ABS integrated body'],
    specifications: [
      { label: 'Sound output', value: '130dB' },
      { label: 'Battery', value: '130mAh Type-C rechargeable lithium battery' },
      { label: 'Charging time', value: 'About 90 minutes' },
      { label: 'Alarm duration', value: 'About 70 minutes' },
      { label: 'Steady light duration', value: 'About 240 minutes' },
      { label: 'Strobe duration', value: 'About 300 minutes' },
      { label: 'Material', value: 'ABS' },
      { label: 'Weight', value: '28 grams' },
      { label: 'Dimensions', value: '100 × 31 × 13.5mm' },
    ],
    howItWorks: [
      { title: 'Carry', text: 'Clip it where it stays within easy reach.' },
      { title: 'Pull', text: 'Remove the top pin to activate the 130dB alarm and flashing LED.' },
      { title: 'Use the light', text: 'Press once for steady light, twice for strobe, and a third time to switch the light off.' },
    ],
    scenarios: ['Campus', 'Commute', 'Travel', 'Evening walks'],
    included: ['Personal SOS Alarm', 'Lithium Ion battery', 'Keychain attachment'],
    accent: '#d7673d',
    highlights: [{ value: '130 dB', label: 'Alarm' }, { value: '28 g', label: 'Carry weight' }, { value: '90 min', label: 'Charging time' }],
    compare: {
      job: 'Makes noise you cannot ignore',
      reachFor: 'Someone is following you, or you need people to look up right now',
      power: 'USB-C rechargeable',
      carry: 'Keyring or bag strap',
      caveat: 'Noise draws attention. It does not stop anyone on its own.',
    },
  },
  {
    id: 'pepper-spray',
    slug: 'pepperspray',
    title: 'Pepper Spray',
    category: 'Tools',
    label: 'Self defence',
    shortDescription: '50ml stream spray with a range of up to 7 feet and a locking cap to help prevent accidental discharge.',
    longDescription: 'A 50ml OC stream canister built for one-handed use, with a locking cap so it stays inert until you release it. Range is up to 7 feet.',
    price: 499,

    images: ['/products/B0HK3641GW Secondary 3.jpg', '/products/B0HK3641GW Secondary 7.jpg'],
    howItWorksImage: '/products/158A9632.jpg',

    features: ['One-hand deployment', 'Protective safety lock', 'Stream spray format', 'Pocket-friendly canister'],
    specifications: [
      { label: 'Formula', value: 'Oleoresin Capsicum (OC) pepper formula' },
      { label: 'Capacity', value: '50ml' },
      { label: 'Range', value: 'Up to 7 feet' },
      { label: 'Safety', value: 'Protective locking cap' },
      { label: 'Build', value: 'Aluminium canister' },
      { label: 'Shelf life', value: 'Up to 3 years' },
    ],
    howItWorks: [
      { title: 'Carry', text: 'Keep it accessible, not buried at the bottom of a bag.' },
      { title: 'Unlock', text: 'Release the protective safety lock.' },
      { title: 'Direct', text: 'Follow the product instructions and move toward help.' },
    ],
    scenarios: ['Commute', 'Travel', 'Parking', 'Walking'],
    included: ['50ml Pepper Spray canister', 'Protective locking cap'],
    accent: '#8f351b',
    highlights: [{ value: '50 ml', label: 'Capacity' }, { value: 'Up to 7 ft', label: 'Range' }, { value: '3 yr', label: 'Shelf life' }],
    compare: {
      job: 'Buys you distance and time',
      reachFor: 'Someone is already close and you need to get away',
      power: 'None. Shelf life up to 3 years',
      carry: 'Jacket pocket or outer bag pocket',
      caveat: 'Rules vary by state and by airline. Check before you travel with it.',
    },
  },
  {
    id: 'window-breaker',
    slug: 'windowbreaker',
    title: 'Emergency Window Breaker',
    category: 'Tools',
    label: 'Emergency escape tool',
    shortDescription: 'Spring-loaded tungsten point for car glass, plus a hidden blade for a stuck seatbelt.',
    longDescription: 'Two tools in a 92-gram body: a spring-loaded tungsten strike point for suitable automotive side glass, and a concealed stainless-steel blade for a seatbelt that will not release.',
    price: 599,
    images: ['/products/window-breaker-mockup.webp'],
    howItWorksImage: '/products/window-breaker-how-to-use.jpg',
    features: ['Spring-loaded strike head', 'Tungsten steel point', 'Concealed seatbelt blade', 'Designed for secure storage within reach in a vehicle'],
    specifications: [
      { label: 'Mechanism', value: 'Spring-loaded high-impact strike head' },
      { label: 'Point', value: 'Tungsten steel' },
      { label: 'Cutter', value: 'Hidden stainless-steel seatbelt blade' },
      { label: 'Body', value: 'Lightweight ABS polymer' },
      { label: 'Weight', value: '92 grams' },
    ],
    howItWorks: [
      { title: 'Store', text: 'Keep it secured and within reach inside the vehicle.' },
      { title: 'Cut', text: 'Use the concealed blade for a jammed seatbelt.' },
      { title: 'Strike', text: 'Press the spring-loaded point against suitable automotive glass.' },
    ],
    scenarios: ['Road trips', 'Daily driving', 'Cab travel', 'Vehicle kits'],
    included: ['Emergency Window Breaker'],
    accent: '#748a83',
    highlights: [{ value: '92 g', label: 'Carry weight' }, { value: 'Tungsten', label: 'Strike point' }, { value: 'Hidden', label: 'Seatbelt blade' }],
    compare: {
      job: 'Gets you out of a car',
      reachFor: 'A seatbelt jams, or a door will not open after a crash',
      power: 'None. Mechanical spring',
      carry: 'Glovebox or door pocket — not your keyring',
      caveat: 'Works on tempered side glass. Windscreens are laminated and will not shatter.',
    },
  },
  {
    id: 'survival-whistle',
    slug: 'whistle',
    title: 'Survival Whistle',
    category: 'Tools',
    label: '120dB dual-tube design',
    shortDescription: '120dB from a 12g piece of aluminium. Nothing to charge, nothing to break.',
    longDescription: 'Twelve grams of aviation-grade aluminium with a dual-tube design that puts out 120dB on one breath. No battery, no electronics, nothing that can fail.',
    price: 299,
    images: ['/products/survival-whistle-mockup.webp', '/products/survival-whistle-ecom.webp', '/lifestyle/whistle-bag-shot.webp'],
    howItWorksImage: '/products/survival-whistle-ecom.webp',
    features: ['Breath activated', 'Dual-tube construction', 'Battery-free', 'Keychain and zipper attachment'],
    specifications: [
      { label: 'Volume output', value: '120dB dual-tube design' },
      { label: 'Material', value: 'Aviation-grade aluminium alloy' },
      { label: 'Power source', value: 'Battery-free / breath powered' },
      { label: 'Format', value: 'Keychain and zipper attachable' },
      { label: 'Weight', value: '12 grams' },
    ],
    howItWorks: [
      { title: 'Attach', text: 'Clip it to a bag, keyring or zipper within reach.' },
      { title: 'Blow', text: 'Use a firm breath to create a clear audible signal.' },
      { title: 'Repeat', text: 'Use repeated bursts to draw attention.' },
    ],
    scenarios: ['Travel', 'Outdoor walks', 'Campus', 'Emergency kits'],
    included: ['Survival Whistle', 'Attachment ring'],
    accent: '#102844',
    highlights: [{ value: '120 dB', label: 'Dual tube' }, { value: '12 g', label: 'Carry weight' }, { value: 'None', label: 'Battery needed' }],
    compare: {
      job: 'Signals for help with zero failure points',
      reachFor: 'You are lost, hurt, or out of phone battery',
      power: 'None. Your breath',
      carry: 'Keyring, zipper pull, or a kid’s school bag',
      caveat: 'Needs you conscious and able to breathe hard.',
    },
  },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

/** Shopify handle for a product, falling back to the URL slug. */
export const handleFor = (product: Pick<Product, 'slug' | 'shopifyHandle'>) => product.shopifyHandle ?? product.slug;

/**
 * Shown wherever a product has no photography yet — a store product added
 * before its media, say. Every image slot needs *some* fallback, and it has to
 * be something that belongs to no product in particular: naming a real one here
 * means a new product silently wears another product's photo.
 */
export const PRODUCT_IMAGE_FALLBACK = '/brand/whaleora-logo.svg';

const localeFor = (currencyCode: string) => (currencyCode === 'INR' ? 'en-IN' : 'en-US');

export const formatPrice = (price: number, currencyCode = 'INR') =>
  new Intl.NumberFormat(localeFor(currencyCode), {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);

