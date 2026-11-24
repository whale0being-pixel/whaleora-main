import type { Metadata } from 'next';
import Link from 'next/link';
import { faqCategories, faqs, faqsByCategory } from '@/lib/content/faq';
import './faq.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Whaleora',
  description: 'Clear answers about Whaleora personal safety products, choosing the right tool, product use, shipping, returns, warranty and support in India.',
  alternates: { canonical: 'https://www.whaleora.com/faq' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer.replace(/\s+/g, ' ').trim(),
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="page-main faq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <header className="shell faq-hero">
        <p className="eyebrow dark">Whaleora · Help & information</p>
        <h1>Good questions.<br /><em>Clear answers.</em></h1>
        <p>Practical answers about choosing, using and caring for everyday safety essentials, plus the details that matter when you place an order.</p>
        <nav className="faq-category-nav" aria-label="FAQ categories">
          {faqCategories.map((category) => <a key={category.id} href={`#faq-${category.id}`}>{category.label}</a>)}
        </nav>
      </header>
      <div className="shell faq-content">
        {faqCategories.map((category) => {
          const entries = faqsByCategory(category.id);
          if (!entries.length) return null;
          return (
            <section className="faq-section" id={`faq-${category.id}`} key={category.id}>
              <div><p className="eyebrow dark">Whaleora answers</p><h2>{category.label}</h2><p>{category.prompt}.</p></div>
              <div>
                {entries.map((item) => (
                  <details key={item.id}>
                    <summary>{item.question}<span aria-hidden="true">+</span></summary>
                    <div className="faq-answer">
                      {item.answer.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                      {item.links?.length ? <nav aria-label={`Related links for ${item.question}`}>{item.links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}</nav> : null}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <section className="shell faq-help">
        <h2>Still have a question?</h2>
        <p>Talk to a person at Whaleora about a product, order or partnership.</p>
        <Link className="button button-primary" href="/contact">Contact support</Link>
      </section>
    </main>
  );
}
