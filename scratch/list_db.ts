import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/streetwear';

async function list() {
  const client = new MongoClient(uri);
  await client.connect();

  // Query streetwear database
  const streetwearDb = client.db('streetwear');
  const streetwearProducts = await streetwearDb.collection('products').find({}).toArray();
  console.log('Streetwear products:');
  console.log(JSON.stringify(streetwearProducts.map(p => ({ id: p._id, name: p.name })), null, 2));

  // Query northline database
  const northlineDb = client.db('northline');
  const northlineProducts = await northlineDb.collection('products').find({}).toArray();
  console.log('\nNorthline products:');
  console.log(JSON.stringify(northlineProducts.map(p => ({ id: p._id, name: p.name })), null, 2));

  await client.close();
}

list();
