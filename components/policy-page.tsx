import type { ReactNode } from 'react';
import Link from 'next/link';
import { POLICIES, type PolicyKey } from '@/lib/content/policies';

function rich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(/\*\*(.+?)\*\*|([\w.+-]+@[\w.-]+\.\w+)/g)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(match[1]
      ? <strong key={start}>{match[1]}</strong>
      : <a key={start} href={`mailto:${match[2]}`}>{match[2]}</a>);
    last = start + match[0].length;
  }
  nodes.push(text.slice(last));
  return nodes;
}

export function PolicyPage({ policy }: { policy: PolicyKey }) {
  const { title, updated, intro, sections } = POLICIES[policy];
  return (
    <main className="page-main policy-page">
      <header className="shell section-pad">
        <p className="eyebrow dark">Whaleora · Customer information</p>
        <h1>{title}</h1>
        <p className="policy-page-updated">Last updated: {updated}</p>
        <p className="policy-page-intro">{intro}</p>
      </header>
      <article className="shell policy-page-content">
        {sections.map((section, index) => (
          <section key={section.title}>
            <h2>{index + 1}. {section.title}</h2>
            {section.body.map((block, blockIndex) => Array.isArray(block)
              ? <ul key={blockIndex}>{block.map((item) => <li key={item}>{rich(item)}</li>)}</ul>
              : <p key={blockIndex}>{rich(block)}</p>)}
          </section>
        ))}
        <nav className="policy-page-nav" aria-label="Customer support policies">
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns & refunds</Link>
          <Link href="/warranty">Warranty</Link>
          <Link href="/contact">Contact support</Link>
        </nav>
      </article>
    </main>
  );
}
