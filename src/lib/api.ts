import type { Product } from '../data/products';
import type { CheckoutStartBody, ShippingFormValues } from './schemas/checkout';

type ApiErrorBody = { error?: string; details?: unknown };

async function readError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text) as ApiErrorBody;
    if (typeof body.error === 'string') return body.error;
  } catch {
    /* ignore */
  }
  return text || res.statusText || 'Request failed';
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { products: Product[] };
  return data.products;
}

export type CheckoutStartResponse = {
  sessionId: string;
  subtotalCents: number;
  devOtp?: string;
};

export async function postCheckoutStart(
  body: CheckoutStartBody,
): Promise<CheckoutStartResponse> {
  const res = await fetch('/api/checkout/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as CheckoutStartResponse;
}

export async function postCheckoutVerify(sessionId: string, code: string) {
  const res = await fetch('/api/checkout/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, code }),
  });
  if (!res.ok) throw new Error(await readError(res));
}

export type CheckoutResendResponse = { ok: true; devOtp?: string };

export async function postCheckoutResend(
  sessionId: string,
): Promise<CheckoutResendResponse> {
  const res = await fetch('/api/checkout/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as CheckoutResendResponse;
}

export function buildCheckoutPayload(
  shipping: ShippingFormValues,
  lines: Array<{ product: Product; qty: number }>,
): CheckoutStartBody {
  return {
    ...shipping,
    items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
  };
}
