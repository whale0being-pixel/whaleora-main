import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

/**
 * Photos attached to a customer review.
 *
 * This endpoint is public by necessity — the person writing a review has no
 * account and no admin session — so the limits are the only thing standing
 * between it and a free image host. Four files, 4 MB each, images only, and
 * the browser must be on our own origin.
 *
 * Nothing is written to Convex here. The upload returns URLs, the review form
 * holds them, and they reach the database only when the review itself is
 * submitted — so an upload that is never followed by a review leaves no row.
 */
const f = createUploadthing();

export const uploadRouter = {
  reviewPhoto: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // Same-origin only. A cross-site page cannot forge this header, so an
      // upload widget embedded elsewhere cannot spend our storage quota.
      const origin = req.headers.get('origin');
      const host = req.headers.get('host');
      const expected = process.env.ADMIN_ORIGIN?.trim();
      const allowed = expected ? [expected] : host ? [`https://${host}`, `http://${host}`] : [];
      if (!origin || !allowed.includes(origin)) throw new UploadThingError('Upload rejected.');
      return {};
    })
    // The client reads the URL from the upload result; this callback only has
    // to exist. Keep it cheap — UploadThing calls it from its own servers.
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

/**
 * True when this deployment has UploadThing configured.
 *
 * A store can run perfectly well without it — the review form simply drops its
 * photo picker rather than offering an upload that would fail — so every page
 * that renders the form asks this first.
 */
export const uploadsConfigured = () => Boolean(process.env.UPLOADTHING_TOKEN?.trim());
