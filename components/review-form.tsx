'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { Check, ImagePlus, Star, X } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useUploadThing } from '@/lib/uploadthing';

type Status = 'idle' | 'uploading' | 'sending' | 'sent' | 'held' | 'duplicate' | 'error';

/** Mirrors the limits set on the reviewPhoto route in app/api/uploadthing/core.ts. */
const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

type Picked = { file: File; preview: string };

export function ReviewForm({ productHandle, productTitle, defaultOpen = false, photosEnabled = false }: { productHandle: string; productTitle: string; defaultOpen?: boolean; photosEnabled?: boolean }) {
  const submit = useMutation(api.reviews.submit);
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<Picked[]>([]);
  const picker = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing('reviewPhoto');

  // Object URLs are the only thing here the browser will not reclaim on its own.
  // The ref is a mirror of the current picks so the unmount cleanup, which runs
  // once and cannot close over later state, still has the last list to revoke.
  const live = useRef<Picked[]>([]);
  useEffect(() => { live.current = photos; }, [photos]);
  useEffect(() => () => { live.current.forEach((item) => URL.revokeObjectURL(item.preview)); }, []);

  function pick(event: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!chosen.length) return;
    const room = MAX_PHOTOS - photos.length;
    const tooBig = chosen.some((file) => file.size > MAX_PHOTO_BYTES);
    const wrongType = chosen.some((file) => !file.type.startsWith('image/'));
    const accepted = chosen.filter((file) => file.type.startsWith('image/') && file.size <= MAX_PHOTO_BYTES).slice(0, room);
    setPhotos((current) => [...current, ...accepted.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    if (wrongType) setError('Photos only — pick a JPG, PNG or WebP.');
    else if (tooBig) setError('Each photo has to be under 4 MB.');
    else if (chosen.length > room) setError(`You can add ${MAX_PHOTOS} photos.`);
    else setError('');
    if (status === 'error' && !wrongType && !tooBig) setStatus('idle');
  }

  function drop(index: number) {
    setPhotos((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return current.filter((_, i) => i !== index);
    });
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) { setError('Pick a rating first.'); setStatus('error'); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    setError('');
    try {
      // Photos go to UploadThing first; only their URLs reach Convex, and only
      // once the review itself is accepted below.
      let images: string[] = [];
      if (photos.length) {
        setStatus('uploading');
        const uploaded = await startUpload(photos.map((item) => item.file));
        if (!uploaded) throw new Error('Those photos did not upload. Try again, or post your review without them.');
        images = uploaded.map((file) => file.ufsUrl);
      }
      setStatus('sending');
      const result = await submit({
        productHandle,
        rating,
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        body: String(data.get('body') ?? ''),
        ...(images.length ? { images } : {}),
      });
      if (!result.ok) { setStatus('duplicate'); return; }
      form.reset();
      setRating(0);
      photos.forEach((item) => URL.revokeObjectURL(item.preview));
      setPhotos([]);
      setStatus(result.held ? 'held' : 'sent');
      // Pull the published review into the list above without a manual reload.
      if (!result.held) router.refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'That did not send. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <div className="review-form is-done" role="status">
      <Check size={20} aria-hidden="true" />
      <div>
        <strong>Thank you — it is live.</strong>
        <p>Your review is published on this page now.</p>
      </div>
    </div>;
  }

  if (status === 'held') {
    return <div className="review-form is-done" role="status">
      <Check size={20} aria-hidden="true" />
      <div>
        <strong>Thank you — we will take a look.</strong>
        <p>This one needs a quick human check before it goes up. If that is not what you expected, email hello@whaleora.com.</p>
      </div>
    </div>;
  }

  if (status === 'duplicate') {
    return <div className="review-form is-done" role="status">
      <Check size={20} aria-hidden="true" />
      <div>
        <strong>You have already reviewed this one.</strong>
        <p>Email hello@whaleora.com if you would like to change what you wrote.</p>
      </div>
    </div>;
  }

  if (!open) {
    return <div className="review-form-cta">
      <button type="button" className="button button-outline" onClick={() => setOpen(true)}>Write a review</button>
      <span>Bought the {productTitle}? Tell the next person what it is actually like.</span>
    </div>;
  }

  return <form className="review-form" onSubmit={send}>
    <p className="eyebrow dark">Your review · {productTitle}</p>

    <fieldset className="review-rating">
      <legend>Rating</legend>
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={value <= rating ? 'is-on' : ''}
            aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
            aria-pressed={value === rating}
            onClick={() => { setRating(value); setError(''); }}
          >
            <Star size={24} strokeWidth={1.6} fill={value <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    </fieldset>

    <div className="review-form-pair">
      <label>Your name<input name="name" maxLength={80} autoComplete="name" required /></label>
      <label>Email<input type="email" name="email" maxLength={160} autoComplete="email" required /><small>Not published. We use it to check the order and to reach you.</small></label>
    </div>

    <label>Your review<textarea name="body" rows={5} maxLength={1200} required placeholder="What did you use it for, and how did it hold up?" /></label>

    {photosEnabled && <div className="review-photo-field">
      <span className="review-photo-label">Add photos <small>Optional · up to {MAX_PHOTOS}, 4 MB each</small></span>
      <div className="review-photo-picks">
        {photos.map((item, index) => <span key={item.preview}>
          {/* A local object URL, so next/image has nothing to optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.preview} alt={`Photo ${index + 1} to attach`} />
          <button type="button" onClick={() => drop(index)} aria-label={`Remove photo ${index + 1}`}><X size={13} /></button>
        </span>)}
        {photos.length < MAX_PHOTOS && <button type="button" className="review-photo-add" onClick={() => picker.current?.click()}>
          <ImagePlus size={18} aria-hidden="true" /><span>Add photo</span>
        </button>}
      </div>
      <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={pick} />
      <small>Photos are published with your review. Do not upload anything showing someone who has not agreed to it.</small>
    </div>}

    {status === 'error' && <p className="form-note form-note-error" role="alert">{error}</p>}

    <div className="review-form-actions">
      <button type="submit" className="button button-primary" disabled={status === 'sending' || status === 'uploading'}>{status === 'uploading' ? 'Uploading photos…' : status === 'sending' ? 'Sending…' : 'Submit review'}</button>
      <button type="button" className="review-form-cancel" onClick={() => setOpen(false)}>Cancel</button>
    </div>
    <p className="review-form-note">Reviews go up as written, good or bad. We only hold ones that trip our abuse and spam filter, and we never publish reviews in exchange for anything.</p>
  </form>;
}
