import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/streetwear';

async function list() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('northline');
  const products = await db.collection('products').find({}).toArray();
  console.log(JSON.stringify(products.map(p => ({ id: p._id, name: p.name })), null, 2));
  await client.close();
}

list();
