import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const database = await getDb();
    const rows = await database
      .collection('products')
      .find({})
      .sort({ _id: 1 })
      .project({
        _id: 1,
        name: 1,
        tagline: 1,
        priceCents: 1,
        image: 1,
        category: 1,
      })
      .toArray();

    res.status(200).json({
      products: rows.map((r) => ({
        id: r._id,
        name: r.name as string,
        tagline: r.tagline as string,
        priceCents: r.priceCents as number,
        image: r.image as string,
        category: (r.category as string) ?? 'General',
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
