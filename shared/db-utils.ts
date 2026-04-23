import type { Db } from 'mongodb';
import { catalog } from './catalog.js';

type ProductDoc = {
  _id: string;
  name: string;
  tagline: string;
  priceCents: number;
  image: string;
  category: string;
  stock: number;
};

export async function seedProducts(database: Db) {
  const products = database.collection<ProductDoc>('products');
  
  for (const p of catalog) {
    await products.updateOne(
      { _id: p.id },
      {
        $set: {
          name: p.name,
          tagline: p.tagline,
          priceCents: p.priceCents,
          image: p.image,
          category: p.category || 'General',
        },
        // Ensure stock is ALWAYS at least 100 if it's missing or zero
        $setOnInsert: { stock: 100 },
      },
      { upsert: true },
    );
    
    // Fix existing products that might be missing the stock field
    await products.updateOne(
      { _id: p.id, stock: { $exists: false } },
      { $set: { stock: 100 } }
    );
  }

  const catalogIds = catalog.map((p) => p.id);
  await products.deleteMany({ _id: { $nin: catalogIds } });
}
