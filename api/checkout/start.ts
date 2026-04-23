import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { getDb } from '../_lib/db';
import { checkoutStartBodySchema } from '../../shared/schemas';
import {
  createPendingOrder,
  priceCheckoutItems,
} from '../../server/checkout';
import { seedProducts } from '../../shared/db-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const database = await getDb();
    // Auto-seed to ensure products have stock fields etc
    await seedProducts(database);

    const parsed = checkoutStartBodySchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
      return;
    }

    const priced = await priceCheckoutItems(database, parsed.data.items);
    if ('error' in priced) {
      res.status(400).json({ error: priced.error });
      return;
    }

    const sessionId = randomUUID();
    const { code } = await createPendingOrder(
      database,
      sessionId,
      parsed.data,
      priced.lines,
      priced.subtotalCents,
    );

    const leakOtp = process.env.NODE_ENV !== 'production';
    
    res.status(200).json({
      sessionId,
      subtotalCents: priced.subtotalCents,
      ...(leakOtp ? { devOtp: code } : {}),
    });
  } catch (error) {
    console.error('Error starting checkout:', error);
    res.status(500).json({ error: 'Failed to start checkout' });
  }
}
