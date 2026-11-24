import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import './trust.css';

export const metadata: Metadata = {
  title: 'Customer Trust & Support | Whaleora',
  description: 'Find Whaleora shipping timelines, returns and refunds, SOS Alarm warranty coverage, product support and creator-shared product videos.',
  alternates: { canonical: 'https://www.whaleora.com/trust' },
};

const assurances = [
  { title: 'Shipping across India', detail: 'Orders are generally processed within 1–2 business days. Estimated delivery is generally 3–7 business days from dispatch; serviceability and local conditions can affect timing.', href: '/shipping', label: 'Read shipping policy' },
  { title: '7-day returns', detail: 'You may request a return within 7 days from delivery. The policy explains change-of-mind returns, damaged or defective products, return shipping and refunds.', href: '/returns', label: 'Read returns & refunds policy' },
  { title: '12-month SOS Alarm warranty', detail: 'The Personal SOS Alarm is covered for 12 months against manufacturing defects. The Survival Whistle, Pepper Spray and Window Breaker are not covered by this warranty.', href: '/warranty', label: 'Check warranty coverage' },
  { title: 'Speak to a person', detail: 'For product questions, order support, returns, warranty claims or partnerships, contact the Whaleora team directly.', href: '/contact', label: 'Contact Whaleora' },
  { title: 'Product information and creator videos', detail: 'Explore product specifications, use instructions, comparisons and creator-shared videos. Product demonstrations are not a substitute for reading the instructions supplied with your product.', href: '/products', label: 'Explore products and creator videos' },
];

export default function TrustPage() {
  return (
    <main className="page-main trust-page">
      <header className="shell trust-hero">
        <p className="eyebrow dark">Whaleora · Customer information</p>
        <h1>Know what to expect.<br /><em>Before you order.</em></h1>
        <p>Clear information about delivery, returns, warranty and how to reach our team. Read the relevant policy for full terms and conditions.</p>
      </header>
      <div className="shell trust-grid">
        {assurances.map((item, index) => (
          <article key={item.title}>
            <span>0{index + 1}</span>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <Link href={item.href}>{item.label} <ArrowRight size={15} aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
      <section className="shell trust-contact">
        <h2>Need help with a specific order?</h2>
        <p>Email <a href="mailto:hello@whaleora.com">hello@whaleora.com</a> with your order number, or use the Contact page.</p>
        <Link className="button button-primary" href="/contact">Get in touch</Link>
      </section>
    </main>
  );
}
