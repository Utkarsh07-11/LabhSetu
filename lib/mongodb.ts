import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "labhsetu";

let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoDb() {
  if (!uri) {
    return null;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 1000,
      serverSelectionTimeoutMS: 1000,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    clientPromise = client.connect().catch((error) => {
      console.warn("MongoDB connection unavailable, falling back to local data.", error);
      clientPromise = null;
      return null as unknown as MongoClient;
    });
  }

  const client = await clientPromise;
  if (!client) {
    return null;
  }
  return client.db(dbName);
}
