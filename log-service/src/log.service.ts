import { ObjectId } from "mongodb"
import { getClient } from "./lib/db.ts"

// Ici on aura que des méthodes qui interragissent avec la BDD

// Le controller sera en charge : 
// - apeler ces méthodes
// - leur fournir les bons params

export const insert = async (log) => {
    // On reçoit un logque le controller aura déjà validé (avec le schéma zod)
    // Le seul rôle u service est de faire l'enregistrement en BDD et de retourner le résultat
    const client = await getClient()
    return await client.db().collection('logs').insertOne(log)
}

export const findAll = async () => {
    const client = await getClient()
    // .find() crée un curseur -> une prérecherche des résultats du find, pour exécuter la recherche et récupérer les résultats du curseur, il faut utiliser.toArray()
    return await client.db().collection('logs').find().toArray()
}

export const findOneById = async (id: string) => {
    const client = await getClient()
    return await client.db().collection('logs').findOne({ _id: new ObjectId(id) })
}