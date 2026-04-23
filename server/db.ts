import { type Db, MongoClient } from 'mongodb';
import { seedProducts } from '../shared/db-utils.js';

const DEFAULT_URI = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/streetwear';
const DEFAULT_DB = 'streetwear';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  const uri = process.env.MONGODB_URI ?? DEFAULT_URI;
  const name = process.env.MONGODB_DB ?? DEFAULT_DB;

  try {
    console.log(`Connecting to MongoDB: ${uri.replace(/:([^:@]+)@/, ':****@')} / db=${name}`);
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(name);
    console.log('MongoDB connected successfully');
    await seedProducts(db);
    return db;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw err;
  }
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
