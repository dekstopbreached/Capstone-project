import { type Db, MongoClient } from 'mongodb';
import { catalog } from '../shared/catalog.js';

const DEFAULT_URI = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/streetwear';
const DEFAULT_DB = 'streetwear';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  const uri = process.env.MONGODB_URI ?? DEFAULT_URI;
  const name = process.env.MONGODB_DB ?? DEFAULT_DB;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(name);
  await seedProducts(db);
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error('MongoDB is not connected. Call connectMongo() first.');
  return db;
}

export async function closeMongo(): Promise<void> {
  await client?.close();
  client = null;
  db = null;
}

type ProductDoc = {
  _id: string;
  name: string;
  tagline: string;
  priceCents: number;
  image: string;
  category: string;
  stock: number;
};

async function seedProducts(database: Db) {
  const products = database.collection<ProductDoc>('products');
  
  // Upsert all products currently in the catalog
  for (const p of catalog) {
    await products.updateOne(
      { _id: p.id },
      {
        $set: {
          name: p.name,
          tagline: p.tagline,
          priceCents: p.priceCents,
          image: p.image,
          category: p.category,
        },
        $setOnInsert: { stock: 100 },
      },
      { upsert: true },
    );
  }

  // Remove any products that are NO LONGER in the catalog
  const catalogIds = catalog.map((p) => p.id);
  await products.deleteMany({ _id: { $nin: catalogIds } });
}
