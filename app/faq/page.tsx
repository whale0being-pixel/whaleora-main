import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { faqCategories, faqs } from '@/lib/content/faq';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Clear answers about Whaleora personal safety products, choosing the right tool, product care, shipping, returns, warranty and partnerships.',
  alternates: { canonical: '/faq' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <main className="page-main faq-directory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <header className="shell section-pad faq-directory-hero">
        <p className="eyebrow dark">Whaleora · Help & information</p>
        <h1>Good questions.<br /><em>Clear answers.</em></h1>
        <p>Practical answers about choosing and using everyday safety tools, caring for your products, placing an order and getting support.</p>
        <nav className="faq-category-nav" aria-label="FAQ topics">
          {faqCategories.map((category) => (
            <a key={category.id} href={`#faq-${category.id}`}>{category.label}</a>
          ))}
        </nav>
      </header>

      <div className="shell faq-directory-content">
        {faqCategories.map((category) => {
          const entries = faqs.filter((item) => item.category === category.id);
          if (!entries.length) return null;
          return (
            <section className="faq-directory-category" id={`faq-${category.id}`} key={category.id}>
              <div className="faq-directory-heading">
                <p className="eyebrow dark">Whaleora help</p>
                <h2>{category.label}</h2>
                <p>{category.prompt}</p>
              </div>
              <div className="faq-directory-list">
                {entries.map((item) => (
                  <details key={item.id}>
                    <summary>{item.question}<span aria-hidden="true">+</span></summary>
                    <div className="faq-directory-answer">
                      {item.answer.split(/\\n\\s*\\n/).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                      {item.links?.length ? (
                        <ul className="faq-directory-links">
                          {item.links.map((link) => (
                            <li key={link.href}><Link href={link.href}>{link.label} <ArrowUpRight size={14} aria-hidden="true" /></Link></li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="shell faq-directory-contact">
        <div>
          <p className="eyebrow dark">Still need a hand?</p>
          <h2>Talk to a real person.</h2>
          <p>For an order update, product question, return or warranty request, our support team can help.</p>
        </div>
        <div className="faq-directory-actions">
          <Link className="button button-primary" href="/contact">Contact Whaleora <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link className="arrow-link" href="/trust">Shipping, returns & warranty information</Link>
        </div>
      </section>
    </main>
  );
}
