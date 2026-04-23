import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { checkoutVerifyBodySchema } from '../../shared/schemas.js';
import { verifyAndConfirmOrder } from '../../server/checkout.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const database = await getDb();
    const parsed = checkoutVerifyBodySchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
      return;
    }

    const result = await verifyAndConfirmOrder(
      database,
      parsed.data.sessionId,
      parsed.data.code,
    );

    if ('error' in result) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error verifying checkout:', error);
    res.status(500).json({ error: 'Failed to verify checkout' });
  }
}
