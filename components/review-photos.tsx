'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

/**
 * The customer photo strip above a product's reviews, and the viewer it opens.
 *
 * Five tiles at most; the last carries a "+N" when there are more behind it.
 * `compact` is the same strip at review-card size, under a single review.
 * The viewer is a native <dialog>, so Escape, the backdrop and focus return all
 * come from the platform rather than from a keydown listener of our own.
 */
export function ReviewPhotos({ photos, heading = 'Customer photos', compact = false }: { photos: string[]; heading?: string | null; compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open === null) return;
    const modal = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; opener?.focus({ preventScroll: true }); };
  }, [open]);

  if (!photos.length) return null;
  const tiles = photos.slice(0, 5);
  const hidden = photos.length - tiles.length;
  const move = (direction: number) => setOpen((value) => (value === null ? value : (value + direction + photos.length) % photos.length));

  return <div className={compact ? 'review-photos is-compact' : 'review-photos'}>
    {heading && <p className="review-photos-heading">{heading}</p>}
    <ul className="review-photos-strip">
      {tiles.map((photo, index) => <li key={`${photo}-${index}`}>
        <button type="button" onClick={() => setOpen(index)} aria-label={`Open customer photo ${index + 1} of ${photos.length}`}>
          <Image src={photo} alt="" fill sizes="96px" />
          {hidden > 0 && index === tiles.length - 1 && <span aria-hidden="true">+{hidden}</span>}
        </button>
      </li>)}
    </ul>

    {open !== null && <dialog ref={dialog} className="review-photo-viewer" aria-label="Customer photos" onClose={() => setOpen(null)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(null); }}>
      <div className="review-photo-viewer-top">
        <span>Photo {open + 1} of {photos.length}</span>
        <button type="button" onClick={() => setOpen(null)} aria-label="Close photo"><X size={20} /></button>
      </div>
      <div className="review-photo-viewer-image"><Image src={photos[open]} alt={`Customer photo ${open + 1}`} fill sizes="90vw" /></div>
      {photos.length > 1 && <div className="review-photo-viewer-nav">
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next photo"><ArrowRight size={18} /></button>
      </div>}
    </dialog>}
  </div>;
}
