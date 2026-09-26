import Link from 'next/link';
import type { ShopProduct } from '@/components/commerce';
import { formatPrice } from '@/data/products';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';

const trustPoints = [
  { figure: '130dB', label: 'Loud dual-siren and strobe, on one pull' },
  { figure: '28g', label: 'Ultra-lightweight, designed for your keyring' },
  { figure: null, label: 'Where the everyday safety collection starts' },
  { figure: '₹1,499+', label: 'Free shipping anywhere in India' },
];

/** `from` is the live catalogue floor; the null figure above is its slot. */
export function TrustBar({ from }: { from: string }) {
  return (
    <section className="trust-bar" aria-label="Whaleora at a glance">
      <dl className="shell">
        {trustPoints.map((point) => (
          <div key={point.label}><dt>{point.figure ?? from}</dt><dd>{point.label}</dd></div>
        ))}
      </dl>
    </section>
  );
}

const rows = [
  { key: 'job', head: 'What it does' },
  { key: 'reachFor', head: 'When you’d reach for it' },
  { key: 'power', head: 'What powers it' },
  { key: 'carry', head: 'Where to keep it' },
  { key: 'caveat', head: 'The honest caveat' },
] as const;

export function Chooser({ catalog }: { catalog: ShopProduct[] }) {
  return (
    <section className="chooser section-pad" id="chooser" data-reveal>
      <div className="shell section-heading">
        <div>
          <p className="eyebrow dark">Not sure which one</p>
          <h2>Pick by your daily routine, not the product.</h2>
        </div>
        <p>The same four safety essentials, compared honestly — including exactly what each one cannot do. Most people start with the SOS Alarm and add the whistle for complete peace of mind.</p>
      </div>

      <div className="shell chooser-scroll">
        <table className="chooser-table">
          <caption className="visually-hidden">Whaleora personal safety products compared by job, daily routine, power source, carry location, and honest limitations</caption>
          <thead>
            <tr>
              <th scope="col"><span className="visually-hidden">Comparison criteria</span></th>
              {catalog.map((product) => (
                <th scope="col" key={product.id}>
                  <Link href={`/products/${product.slug}`}>
                    <small>{product.category}</small>
                    <strong>{product.title}</strong>
                    <b>{formatPrice(product.price, product.currencyCode)}</b>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className={row.key === 'caveat' ? 'is-caveat' : undefined}>
                <th scope="row">{row.head}</th>
                {catalog.map((product) => <td key={product.id}>{product.compare[row.key]}</td>)}
              </tr>
            ))}
            <tr className="chooser-actions">
              <th scope="row"><span className="visually-hidden">Buy</span></th>
              {catalog.map((product) => (
                <td key={product.id}><Link href={`/products/${product.slug}`} className="chooser-cta">View <span aria-hidden="true"><ArrowRight size={16} strokeWidth={2} /></span></Link></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="chooser-hint" aria-hidden="true">Swipe to compare <ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></p>
    </section>
  );
}

const objections = [
  {
    q: 'Will a personal alarm physically stop an attacker?',
    a: 'No, and we will never pretend otherwise. What a 130dB siren does is instantly remove an aggressor’s most critical advantage: privacy. It startles them, forces bystanders to look up, and buys you vital seconds to move to safety. Seconds are usually the whole game.',
  },
  {
    q: 'Is pepper spray legal to carry in India?',
    a: 'In most parts of India, yes—but venue rules vary. Airlines, courts, and some university campuses strictly prohibit it. Always check local guidelines before you travel. We would rather lose a sale than have your tool confiscated at a security checkpoint.',
  },
  {
    q: 'What happens when the SOS Alarm battery dies?',
    a: 'The SOS Alarm runs on a modern, rechargeable Lithium-Ion battery. It comes with a C-Type USB cable in the box, and a single charge lasts up to a month on standby. The whistle and the window breaker require no battery at all, which is exactly why they make the perfect fail-safe backups.',
  },
  {
    q: 'Can I pack these safety tools on a flight?',
    a: 'The survival whistle is completely safe to fly with. Pepper spray is strictly prohibited on almost every airline, both in the cabin and in checked bags. The window breaker contains a concealed blade and should remain in your car, never in a carry-on.',
  },
  {
    q: 'Why should I choose Whaleora over a cheaper alarm online?',
    a: 'Your peace of mind shouldn’t rely on a compromised product. Many cheap, unbranded alarms falsely claim 130dB output. We provide exact, honest specifications—verified volume, lightweight build, and rechargeable batteries—because we expect you to hold us to them. If a tool doesn’t hold up, email us and a real person will make it right.',
  },
];

export function Objections() {
  // --- NEW: AI & SEO FAQ Schema Injection ---
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: objections.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section className="objections shell section-pad" data-reveal>
      {/* --- NEW: Invisible Schema Injection --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div>
        <p className="eyebrow dark">Before you decide</p>
        <h2>Fair questions, honest answers.</h2>
        <p className="objections-note">Including the realities that don’t help us sell anything.</p>
        <Link href="/contact" className="arrow-link">Ask our team anything else <span aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2} /></span></Link>
      </div>
      <div className="objection-list">
        {objections.map((item, index) => (
          <details key={item.q} open={index === 0}>
            <summary>{item.q}<span aria-hidden="true"><Plus size={17} strokeWidth={2} /></span></summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}