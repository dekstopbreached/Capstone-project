import type { Db } from 'mongodb';
import { randomInt } from 'node:crypto';
import type { CheckoutStartBody } from '../shared/schemas.js';

const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

export type PricedLine = {
  productId: string;
  qty: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type OrderItemDoc = {
  productId: string;
  qty: number;
  unitPriceCents: number;
};

export type OrderDoc = {
  _id: string;
  status: 'pending_verification' | 'confirmed';
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  createdAt: Date;
  items: OrderItemDoc[];
  verification?: { code: string; expiresAtMs: number };
};

export async function priceCheckoutItems(
  database: Db,
  items: CheckoutStartBody['items'],
): Promise<{ lines: PricedLine[]; subtotalCents: number } | { error: string }> {
  const products = database.collection<{ _id: string; priceCents: number; stock: number }>(
    'products',
  );

  const lines: PricedLine[] = [];
  let subtotalCents = 0;

  for (const row of items) {
    const p = await products.findOne({ _id: row.productId });
    if (!p) {
      return { error: `Unknown product: ${row.productId}` };
    }
    if (p.stock < row.qty) {
      return { error: `Insufficient stock for ${row.productId}` };
    }
    const lineTotalCents = p.priceCents * row.qty;
    subtotalCents += lineTotalCents;
    lines.push({
      productId: row.productId,
      qty: row.qty,
      unitPriceCents: p.priceCents,
      lineTotalCents,
    });
  }

  return { lines, subtotalCents };
}

export async function createPendingOrder(
  database: Db,
  sessionId: string,
  body: CheckoutStartBody,
  lines: PricedLine[],
  subtotalCents: number,
): Promise<{ code: string }> {
  const code = generateOtp();
  const expiresAtMs = Date.now() + OTP_TTL_MS;
  const orders = database.collection<OrderDoc>('orders');

  const doc: OrderDoc = {
    _id: sessionId,
    status: 'pending_verification',
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    addressLine: body.addressLine,
    city: body.city,
    postalCode: body.postalCode,
    country: body.country,
    subtotalCents,
    createdAt: new Date(),
    items: lines.map((l) => ({
      productId: l.productId,
      qty: l.qty,
      unitPriceCents: l.unitPriceCents,
    })),
    verification: { code, expiresAtMs },
  };

  await orders.insertOne(doc);
  return { code };
}

export async function replaceVerificationCode(
  database: Db,
  sessionId: string,
): Promise<{ code: string } | { error: string }> {
  const orders = database.collection<OrderDoc>('orders');
  const order = await orders.findOne({ _id: sessionId });

  if (!order) return { error: 'Session not found' };
  if (order.status !== 'pending_verification') {
    return { error: 'Order is not awaiting verification' };
  }

  const code = generateOtp();
  const expiresAtMs = Date.now() + OTP_TTL_MS;

  await orders.updateOne(
    { _id: sessionId },
    { $set: { verification: { code, expiresAtMs } } },
  );

  return { code };
}

export async function verifyAndConfirmOrder(
  database: Db,
  sessionId: string,
  code: string,
): Promise<{ ok: true } | { error: string }> {
  const orders = database.collection<OrderDoc>('orders');
  const products = database.collection<{ _id: string; stock: number }>('products');

  const order = await orders.findOne({ _id: sessionId });

  if (!order) return { error: 'Session not found' };
  if (order.status !== 'pending_verification') {
    return { error: 'Order already processed' };
  }

  const v = order.verification;
  if (!v) return { error: 'No verification code for this session' };
  if (Date.now() > v.expiresAtMs) {
    return { error: 'Code expired. Request a new code.' };
  }
  if (v.code !== code) {
    return { error: 'Invalid code' };
  }

  const applied: Array<{ productId: string; qty: number }> = [];

  for (const item of order.items) {
    const r = await products.updateOne(
      { _id: item.productId, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } },
    );
    if (r.modifiedCount !== 1) {
      for (const a of applied) {
        await products.updateOne({ _id: a.productId }, { $inc: { stock: a.qty } });
      }
      return { error: 'Inventory changed; please start checkout again.' };
    }
    applied.push({ productId: item.productId, qty: item.qty });
  }

  await orders.updateOne(
    { _id: sessionId },
    {
      $set: { status: 'confirmed' },
      $unset: { verification: '' },
    },
  );

  return { ok: true };
}
