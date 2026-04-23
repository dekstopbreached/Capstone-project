import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/northline';

async function remove() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('northline');
  const products = db.collection('products');
  const idsToRemove = [
    'bag-sling-tech',
    'bag-cyber-messenger',
    'backpack-urban-elite',
    'bag-mini-crossbody'
  ];
  const res = await products.deleteMany({ _id: { $in: idsToRemove } } as any);
  console.log(`Deleted ${res.deletedCount} items from northline DB.`);
  await client.close();
}

remove().catch(console.error);
