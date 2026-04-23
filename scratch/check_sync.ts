import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://ayushbhardwaj1600_db_user:HXmVgzcOaPF7MSjC@cluster0.asioxr7.mongodb.net/';

async function check() {
  const client = new MongoClient(uri);
  await client.connect();
  
  const dbs = await client.db().admin().listDatabases();
  console.log('Available databases:', dbs.databases.map(d => d.name));

  for (const dbName of ['northline', 'streetwear']) {
    const db = client.db(dbName);
    const count = await db.collection('products').countDocuments();
    console.log(`Database: ${dbName}, Product count: ${count}`);
    if (count > 0) {
      const sample = await db.collection('products').findOne({});
      console.log(`Sample from ${dbName}: ${sample?.name}`);
    }
  }

  await client.close();
}

check().catch(console.error);
