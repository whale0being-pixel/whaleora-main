import { createRouteHandler } from 'uploadthing/next';
import { uploadRouter } from './core';

export const runtime = 'nodejs';

// Reads UPLOADTHING_TOKEN from the environment. Without it the route answers
// with an error and the review form hides its photo picker, so the rest of the
// review flow keeps working on a deployment that has no uploads configured.
export const { GET, POST } = createRouteHandler({ router: uploadRouter });
