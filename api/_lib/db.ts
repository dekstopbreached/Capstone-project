import { MongoClient, type Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB: string = process.env.MONGODB_DB || 'streetwear';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(MONGODB_DB);
  return cachedDb;
}
