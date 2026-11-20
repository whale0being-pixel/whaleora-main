import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Hourly rather than only when something new is posted: Instagram's image
// URLs are signed and expire, so even an unchanged feed needs fresh links.
crons.interval('sync instagram feed', { hours: 1 }, internal.instagram.sync);

// Daily, though a refresh only happens once the token is a week old: a failed
// attempt is then retried the next day, not the next week.
crons.daily('refresh instagram token', { hourUTC: 3, minuteUTC: 0 }, internal.instagram.refreshToken);

export default crons;
