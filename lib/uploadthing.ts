'use client';

import { generateReactHelpers } from '@uploadthing/react';
import type { UploadRouter } from '@/app/api/uploadthing/core';

/**
 * Typed upload helpers for the review form.
 *
 * The hook rather than UploadThing's own <UploadButton>: the storefront has its
 * own buttons and its own CSS, and the packaged component brings Tailwind
 * classes this project does not load.
 */
export const { useUploadThing } = generateReactHelpers<UploadRouter>();
