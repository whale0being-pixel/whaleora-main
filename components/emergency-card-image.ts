import type { CardData } from '@/lib/emergency-card';

/**
 * The emergency card drawn to a PNG, for phones.
 *
 * window.print() is the desktop path, but on a phone it often does nothing —
 * in-app browsers (Instagram, WhatsApp) ignore it outright, and few people have
 * a printer to hand anyway. An image can be saved to the photo library or set
 * as a lock screen, which is where the card is actually needed.
 *
 * Drawn by hand on a canvas rather than by snapshotting the DOM: it needs no
 * network or library, so it keeps the card's promise of working offline, and
 * it behaves the same in Safari as everywhere else. The measurements mirror the
 * .ec-* rules in globals.css, in the same container units (1u = 1% of width).
 */

type EmergencyNumber = { label: string; number: string; note?: string };

export type CardImageInput = {
  data: CardData;
  sample: CardData;
  numbers: EmergencyNumber[];
  /** Resolved font stacks, read from the rendered preview (next/font hashes the names). */
  fonts: { display: string; sans: string };
};

const W = 1712; // 85.6 mm at 20 px/mm
const H = Math.round((W * 54) / 85.6);
const u = W / 100;
const PAD = 64;
const GAP = 48;

const INK = '16,40,68';
const TERRACOTTA = '#d7673d';
const SAND = '#ddbb98';
const PEACH = '#f0d2b2';
const PLACEHOLDER_ALPHA = 0.38;

let markPromise: Promise<HTMLImageElement> | null = null;
const loadMark = () => {
  markPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = '/brand/whaleora-fin.svg';
  });
  return markPromise;
};

type Ctx = CanvasRenderingContext2D;

function rounded(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Sets font and tracking together; tracking is an em fraction, as in the CSS. */
function font(ctx: Ctx, weight: number, size: number, family: string, tracking = 0) {
  ctx.font = `${weight} ${size}px ${family}`;
  // Not every canvas supports letterSpacing yet; the text is still legible without it.
  if ('letterSpacing' in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${tracking * size}px`;
}

function fit(ctx: Ctx, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > max) cut = cut.slice(0, -1);
  return `${cut.trimEnd()}…`;
}

function wrap(ctx: Ctx, text: string, max: number, lines: number) {
  const out: string[] = [];
  let line = '';
  const words = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(next).width <= max || !line) { line = next; continue; }
    out.push(line);
    line = words[i];
    if (out.length === lines - 1) { line = words.slice(i).join(' '); break; }
  }
  if (line) out.push(line);
  return out.map((l, i) => (i === out.length - 1 ? fit(ctx, l, max) : l));
}

/** A value, or its sample in placeholder grey, as on the preview. */
function pick(value: string, fallback: string) {
  const v = value.trim();
  return { text: v || fallback, alpha: v ? 1 : PLACEHOLDER_ALPHA };
}

function text(ctx: Ctx, value: { text: string; alpha: number }, x: number, y: number) {
  ctx.globalAlpha = value.alpha;
  ctx.fillText(value.text, x, y);
  ctx.globalAlpha = 1;
}

function face(ctx: Ctx, y: number, from: string, to: string, ring: string) {
  const g = ctx.createLinearGradient(0, y, W * 0.27, y + H);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  rounded(ctx, 0, y, W, H, 2.6 * u);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  ctx.clip();
  return () => {
    ctx.restore();
    rounded(ctx, 1, y + 1, W - 2, H - 2, 2.6 * u);
    ctx.strokeStyle = ring;
    ctx.lineWidth = 2;
    ctx.stroke();
  };
}

/** The coloured header strip, returning where the body starts. */
function stripe(ctx: Ctx, y: number, label: string, bg: string, color: string, mark: HTMLCanvasElement, sans: string) {
  const h = 2.3 * u * 2 + 7.8 * u;
  ctx.fillStyle = bg;
  ctx.fillRect(0, y, W, h);
  ctx.fillStyle = color;
  font(ctx, 700, 2.3 * u, sans, 0.16);
  ctx.textBaseline = 'middle';
  ctx.fillText(label.toUpperCase(), 5.6 * u, y + h / 2);
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 0.95;
  ctx.drawImage(mark, W - 5.6 * u - 6.6 * u, y + 2.3 * u, 6.6 * u, 7.8 * u);
  ctx.globalAlpha = 1;
  return y + h;
}

/** The brand fin, filled white (canvas filters are not available in Safari). */
function whiteMark(img: HTMLImageElement) {
  const c = document.createElement('canvas');
  c.width = Math.round(6.6 * u);
  c.height = Math.round(7.8 * u);
  const m = c.getContext('2d')!;
  const scale = Math.min(c.width / img.naturalWidth, c.height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  m.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  m.globalCompositeOperation = 'source-in';
  m.fillStyle = '#fff';
  m.fillRect(0, 0, c.width, c.height);
  return c;
}

function drawFront(ctx: Ctx, y: number, { data, sample, fonts }: CardImageInput, mark: HTMLCanvasElement) {
  const done = face(ctx, y, '#fffdf8', '#f4ead8', `rgba(${INK},.12)`);
  const left = 5.6 * u;
  const inner = W - 2 * left;
  let top = stripe(ctx, y, 'In case of emergency', TERRACOTTA, '#fff', mark, fonts.sans) + 3.4 * u;

  // Blood group chip, top right.
  const blood = data.blood && data.blood !== 'Not known' ? data.blood : '';
  font(ctx, blood ? 700 : 600, 3.6 * u, fonts.sans, 0.02);
  const chipW = Math.max(11 * u, ctx.measureText(blood || 'Blood').width + 4.4 * u);
  const chipH = 3.6 * u * 1.2 + 2 * u;
  const chipX = W - left - chipW;
  rounded(ctx, chipX, top, chipW, chipH, u);
  if (blood) {
    ctx.fillStyle = TERRACOTTA;
    ctx.fill();
    ctx.fillStyle = '#fff';
  } else {
    ctx.strokeStyle = `rgba(${INK},.22)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `rgba(${INK},.42)`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(blood || 'Blood', chipX + chipW / 2, top + chipH / 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Name, up to two lines beside the chip.
  const name = pick(data.name, sample.name);
  const nameSize = 7.2 * u;
  font(ctx, 500, nameSize, fonts.display, -0.02);
  ctx.fillStyle = `rgb(${INK})`;
  for (const line of wrap(ctx, name.text, inner - chipW - 3 * u, 2)) {
    text(ctx, { ...name, text: line }, left, top);
    top += nameSize * 1.02;
  }

  // Notes, up to two lines.
  top += 1.2 * u;
  const notes = pick(data.notes, sample.notes);
  const notesSize = 2.85 * u;
  font(ctx, 400, notesSize, fonts.sans);
  ctx.fillStyle = `rgba(${INK},.68)`;
  for (const line of wrap(ctx, notes.text, inner, 2)) {
    text(ctx, { ...notes, text: line }, left, top);
    top += notesSize * 1.4;
  }

  // Contacts, pinned to the bottom edge.
  const rows = 4.4 * 1.2 + 0.2 + 2.9 * 1.2 + 0.2 + 2.2 * 1.2;
  let cy = y + H - 4.6 * u - rows * u - 1.4 * u - 2.3 * u * 1.2 - 2.8 * u;
  ctx.fillStyle = `rgba(${INK},.14)`;
  ctx.fillRect(left, cy, inner, 2);
  cy += 2.8 * u;
  font(ctx, 600, 2.3 * u, fonts.sans, 0.12);
  ctx.fillStyle = TERRACOTTA;
  ctx.fillText('PLEASE CALL', left, cy);
  cy += 2.3 * u * 1.2 + 1.4 * u;

  const colW = (inner - 4 * u) / 2;
  const contacts = [
    [data.contactOnePhone, sample.contactOnePhone, data.contactOneName, sample.contactOneName, data.contactOneRelation, sample.contactOneRelation],
    [data.contactTwoPhone, sample.contactTwoPhone, data.contactTwoName, sample.contactTwoName, data.contactTwoRelation, sample.contactTwoRelation],
  ];
  contacts.forEach(([phone, phoneS, who, whoS, rel, relS], i) => {
    const x = left + i * (colW + 4 * u);
    let ly = cy;
    ctx.fillStyle = `rgb(${INK})`;
    font(ctx, 700, 4.4 * u, fonts.sans, -0.02);
    const p = pick(phone, phoneS);
    text(ctx, { ...p, text: fit(ctx, p.text, colW) }, x, ly);
    ly += 4.4 * u * 1.2 + 0.2 * u;
    font(ctx, 600, 2.9 * u, fonts.sans, -0.005);
    const n = pick(who, whoS);
    text(ctx, { ...n, text: fit(ctx, n.text, colW) }, x, ly);
    ly += 2.9 * u * 1.2 + 0.2 * u;
    font(ctx, 400, 2.2 * u, fonts.sans, 0.08);
    ctx.fillStyle = `rgba(${INK},.5)`;
    const r = pick(rel, relS);
    text(ctx, { ...r, text: fit(ctx, r.text.toUpperCase(), colW) }, x, ly);
  });

  done();
}

function drawBack(ctx: Ctx, y: number, { data, sample, numbers, fonts }: CardImageInput, mark: HTMLCanvasElement) {
  const done = face(ctx, y, '#173454', '#0a1b2f', 'rgba(255,255,255,.12)');
  const left = 5.6 * u;
  const inner = W - 2 * left;
  const [primary, ...rest] = numbers;
  let top = stripe(ctx, y, 'Emergency numbers · India', 'rgba(255,255,255,.08)', PEACH, mark, fonts.sans) + 3 * u;

  // 112, with its label set on the same baseline.
  ctx.textBaseline = 'alphabetic';
  const bigSize = 11.4 * u;
  const baseline = top + bigSize * 0.86;
  font(ctx, 600, bigSize, fonts.sans, -0.04);
  ctx.fillStyle = PEACH;
  ctx.fillText(primary.number, left, baseline);
  const lx = left + ctx.measureText(primary.number).width + 2.8 * u;
  font(ctx, 400, 2.4 * u, fonts.sans);
  ctx.fillStyle = 'rgba(255,255,255,.58)';
  if (primary.note) ctx.fillText(primary.note, lx, baseline);
  font(ctx, 600, 3 * u, fonts.sans);
  ctx.fillStyle = '#fff';
  ctx.fillText(primary.label, lx, baseline - 2.4 * u * 1.2 - 0.3 * u);
  top = top + bigSize * 0.92 + 2.4 * u;

  // The other four numbers.
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(left, top, inner, 2);
  top += 2.4 * u;
  const colW = (inner - 3 * 1.6 * u) / 4;
  rest.forEach((item, i) => {
    const x = left + i * (colW + 1.6 * u);
    font(ctx, 600, 4.2 * u, fonts.sans);
    ctx.fillStyle = '#fff';
    ctx.fillText(item.number, x, top);
    font(ctx, 400, 2.1 * u, fonts.sans, 0.06);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillText(fit(ctx, item.label.toUpperCase(), colW), x, top + 4.2 * u * 1.2 + 0.3 * u);
  });

  // Address, pinned to the bottom edge, up to two lines.
  const addrSize = 2.9 * u;
  font(ctx, 400, addrSize, fonts.sans);
  const address = pick(data.address, sample.address);
  const lines = wrap(ctx, address.text, inner, 2);
  let ay = y + H - 4.6 * u - lines.length * addrSize * 1.35 - 0.8 * u - 2.3 * u * 1.2;
  font(ctx, 600, 2.3 * u, fonts.sans, 0.12);
  ctx.fillStyle = SAND;
  ctx.fillText('HOME ADDRESS', left, ay);
  ay += 2.3 * u * 1.2 + 0.8 * u;
  font(ctx, 400, addrSize, fonts.sans);
  ctx.fillStyle = 'rgba(255,255,255,.86)';
  for (const line of lines) {
    text(ctx, { ...address, text: line }, left, ay);
    ay += addrSize * 1.35;
  }

  done();
}

/** Both faces, front above back, on the page's deep blue. */
export async function renderCardImage(input: CardImageInput): Promise<Blob> {
  const [img] = await Promise.all([loadMark(), document.fonts?.ready]);
  const mark = whiteMark(img);

  const canvas = document.createElement('canvas');
  canvas.width = W + PAD * 2;
  canvas.height = H * 2 + GAP + PAD * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0a1b2f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(PAD, PAD);
  ctx.textBaseline = 'top';
  drawFront(ctx, 0, input, mark);
  drawBack(ctx, H + GAP, input, mark);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the card'))), 'image/png');
  });
}
