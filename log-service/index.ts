import Express from 'express'
import { getClient } from './src/lib/db.ts';

const PORT = process.env.PORT || 3001;

const app = Express()

// Démarre un serveur
app.listen(PORT, () => {
    console.info(`🚀 Server started at http://localhost:${PORT}`);
});


console.log("ENV : ", process.env);



// Demo requête mongodb

// importer le client
// const client = await getClient()

// insérer une donnée
// await client.db().collection('collection_test').insertOne({ hello: 'world' })