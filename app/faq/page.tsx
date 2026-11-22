import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Personal Safety FAQs: Products, Shipping & Warranty',
  description: 'Clear answers about Whaleora personal safety products, how they work, shipping, warranty coverage, travel considerations and customer support.',
  alternates: { canonical: '/faq' },
};

const faqs = [
  { question: 'What personal safety products does Whaleora make?', answer: 'Whaleora offers four everyday safety essentials: a Personal SOS Alarm, Pepper Spray, Survival Whistle and Emergency Window Breaker. Each is designed for a different situation; they are not interchangeable.' },
  { question: 'How does the Whaleora Personal SOS Alarm work?', answer: 'The Personal SOS Alarm uses pull-pin activation. Removing the pin activates a 130dB dual siren and a strobe light. Reinsert the pin to stop it. The listed product weight is 28 grams and its battery is rechargeable via the included C-Type USB cable.' },
  { question: 'Does the SOS Alarm need a phone app or Bluetooth?', answer: 'No. The alarm is activated by pulling its pin. It does not require an app, phone pairing or Bluetooth connection.' },
  { question: 'Is the Survival Whistle battery-free?', answer: 'Yes. The Whaleora Survival Whistle is breath-powered, with a dual-tube design. Its listed sound output is 120dB, its weight is 12 grams, and its material is aviation-grade aluminium alloy.' },
  { question: 'What are the specifications of the Whaleora Pepper Spray?', answer: 'The listed product specifications are a 50ml Oleoresin Capsicum (OC) stream formula, a stated range of up to 8–10 feet, a protective locking cap, an aluminium canister and a shelf life of up to three years. Follow the product instructions and check applicable local, venue and airline rules before carrying it.' },
  { question: 'What does the Emergency Window Breaker do?', answer: 'The Emergency Window Breaker combines a spring-loaded tungsten strike point with a concealed stainless-steel seatbelt blade. The product information states that it is intended for suitable tempered automotive side glass; laminated windscreens are not designed to shatter in the same way.' },
  { question: 'How much does shipping cost?', answer: 'Whaleora offers free shipping on orders over ₹849 across India. For orders below that threshold, the shipping charge and delivery estimate for your pincode are shown at checkout.' },
  { question: 'Which Whaleora product has a warranty?', answer: 'The Personal SOS Alarm is covered by a 12-month warranty against manufacturing defects. The current warranty page states that the Survival Whistle, Pepper Spray and Emergency Window Breaker are not covered by this warranty. Read the warranty page for coverage and claim steps.' },
  { question: 'Can I carry pepper spray or a safety tool while travelling?', answer: 'Rules can vary by destination, airline, transport provider and venue. Check the applicable rules before travelling, especially for pepper spray and tools that contain a blade. Do not assume an item is permitted in cabin or checked baggage.' },
  { question: 'How do I ask about an order, return or product issue?', answer: 'Contact Whaleora at hello@whaleora.com or use the contact page before sending an item back. Include your order number and a short description of the issue so the team can guide you through the next step.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function FaqPage() {
  return (
    <main className="page-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="section-pad shell">
        <header className="section-heading">
          <p className="eyebrow dark">Whaleora · Help & product information</p>
          <h1>Clear answers.<br /><em>More confident choices.</em></h1>
          <p>Practical information about our safety essentials, product specifications, shipping and support. Always read the instructions supplied with your product.</p>
        </header>
        <div className="pdp-faq-list" style={{ maxWidth: '900px', margin: '3rem auto 0' }}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}<span>+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
        <div style={{ maxWidth: '900px', margin: '3rem auto 0', display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
          <Link className="button button-primary" href="/products">Compare the products</Link>
          <Link className="button button-outline" href="/warranty">Read warranty coverage</Link>
          <Link className="text-link" href="/contact">Contact Whaleora</Link>
        </div>
      </section>
    </main>
  );
}
