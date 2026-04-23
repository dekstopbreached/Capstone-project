import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { checkoutResendBodySchema } from '../../shared/schemas.js';
import { replaceVerificationCode } from '../../server/checkout.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const database = await getDb();
    const parsed = checkoutResendBodySchema.safeParse(req.body);
    
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
      return;
    }

    const result = await replaceVerificationCode(
      database,
      parsed.data.sessionId,
    );
    
    if ('error' in result) {
      res.status(400).json({ error: result.error });
      return;
    }

    const leakOtp = process.env.NODE_ENV !== 'production';
    
    res.status(200).json({
      ok: true,
      ...(leakOtp ? { devOtp: result.code } : {}),
    });
  } catch (error) {
    console.error('Error resending verification:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
}
