import { getClient } from "./lib/db.ts"

// Ici on aura que des méthodes qui interragissent avec la BDD

// Le controller sera en charge : 
// - apeler ces méthodes
// - leur fournir les bons params

export const insertLog = async (log) => {
    // On reçoit un logque le controller aura déjà validé (avec le schéma zod)
    // Le seul rôle u service est de faire l'enregistrement en BDD et de retourner le résultat
    const client = await getClient()
    return await client.db().collection('logs').insertOne(log)
}