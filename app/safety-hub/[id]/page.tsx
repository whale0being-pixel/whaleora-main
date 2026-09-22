import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hubChecklists } from '@/data/safety-hub'; 

export async function generateStaticParams() {
  return hubChecklists.map((checklist) => ({
    id: checklist.id,
  }));
}

// FIX: Updated to Promise and added await to match Next.js 15 requirements
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const checklist = hubChecklists.find((c) => c.id === id);
  
  if (!checklist) return {};

  return {
    title: `${checklist.title} | Whaleora Safety Hub`,
    description: checklist.description,
  };
}
  
export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const checklist = hubChecklists.find((c) => c.id === id);
  
  if (!checklist) {
    notFound();
  }

  const otherModules = hubChecklists.filter(c => c.id !== id).slice(0, 3);

  return (
    <main className="page-main section-pad shell">
      
      <div className="protocol-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        <article className="protocol-content" style={{ maxWidth: '480px' }}>
          <header className="protocol-heading" style={{ marginBottom: '2rem' }}>
            <p className="eyebrow dark">Protocol / {String(checklist.id).padStart(2, '0')}</p>
            <h1 style={{ fontSize: '2rem', lineHeight: '1.1', margin: '0.5rem 0' }}>{checklist.title}</h1>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.4' }}>{checklist.description}</p>
          </header>

          <ol className="spec-steps" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
            {checklist.items.map((item, index) => (
              <li key={index} style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color, #eaeaea)', paddingTop: '1.25rem' }}>
                <strong style={{ fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.5, marginTop: '0.2rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </strong>
                <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>{item}</p>
              </li>
            ))}
          </ol>
          
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/products" className="button button-outline" style={{ fontSize: '0.8rem', padding: '0.75rem 1.5rem' }}>
              Shop safety essentials
            </Link>
          </div>
        </article>

        <aside className="protocol-media" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '2rem' }}>
          
          {/* @ts-ignore - Assuming imageUrl is added to your data types later */}
          {checklist.imageUrl && (
            <figure style={{ position: 'relative', aspectRatio: '4/3', width: '100%', margin: 0, overflow: 'hidden', backgroundColor: '#f4f4f4' }}>
              <Image 
                /* @ts-ignore */
                src={checklist.imageUrl} 
                fill 
                sizes="(max-width: 900px) 100vw, 50vw" 
                style={{ objectFit: 'cover' }} 
                alt={`${checklist.title} reference visual`} 
              />
            </figure>
          )}

          {/* @ts-ignore - Assuming videoUrl is added to your data types later */}
          {checklist.videoUrl && (
            <div className="video-wrapper" style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
              <video 
                /* @ts-ignore */
                src={checklist.videoUrl} 
                controls 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          
          {/* @ts-ignore */}
          {(checklist.imageUrl || checklist.videoUrl) && (
            <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>Reference visual for field application.</p>
          )}
        </aside>

      </div>

      {otherModules.length > 0 && (
        <section className="related-modules" style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '2px solid #111' }}>
          <p className="eyebrow dark" style={{ marginBottom: '1.5rem' }}>More Protocols</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {otherModules.map(module => (
              <Link href={`/safety-hub/${module.id}`} key={module.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #eaeaea' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{module.title}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>View specs &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}