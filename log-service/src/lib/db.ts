import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ??
  process.env.DATABASE_URL ??
  "mongodb://localhost:27017/logs_db";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getClient(): Promise<MongoClient> {
  if (client) return client;

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

export async function closeClient(): Promise<void> {
  if (!client) return;
  await client.close();
  client = null;
}
/**
 * Connexion Mongo (singleton).
 * À appeler au démarrage (ou à la première requête).
 */
export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(MONGODB_URI);
  await client.connect();

  db = client.db(); // prend le nom de DB depuis l'URI (ex: /logs_db)
  return db;
}

/**
 * Helper typé pour récupérer une collection.
 */
export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const database = await getDb();
  return database.collection<T>(name);
}

/**
 * Fermeture propre (utile pour tests / arrêt du serveur)
 */
export async function closeDb(): Promise<void> {
  if (!client) return;
  await client.close();
  client = null;
  db = null;
}