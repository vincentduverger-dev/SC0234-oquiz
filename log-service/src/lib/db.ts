// Client pour envoyer des requetes à la DB mongo

import { MongoClient } from "mongodb"


let cachedClient: MongoClient | null = null;

// On exporte le client pour faire les requêtes dans nos controllers

export const getClient = async () => {
    const url = process.env.DATABASE_URL || 'mongodb://logs-db:27017/logs_db'

    if (cachedClient) return cachedClient;

    const client = new MongoClient(url);
    await client.connect();
    cachedClient = client;
    return client;
}