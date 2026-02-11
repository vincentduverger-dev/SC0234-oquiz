import { ObjectId, type InsertOneResult } from "mongodb"
import { getClient } from "./lib/db.ts"
import type { createLogDTO } from "./validators/logs.ts"

// Ici on aura que des méthodes qui interragissent avec la BDD

// Le controller sera en charge : 
// - apeler ces méthodes
// - leur fournir les bons params


export interface LogDocument {
    _id?: ObjectId
    // Propriétés obligatoires
    timestamp: Date;
    level: string;
    message: string;
    service: string;
    pid?: number;
    // Propriétés optionnelles : on les type quand même car si elles sont présentes, on veut qu'elles soient du bon type
    method?: string;
    path?: string;
    status?: number;
    ip?: string;
    useragent?: string;
    durationMS?: number;
    requestId?: string;
    stack?: string;
    // On utilise mongoDB et on va laisser passer toutes les propriétés, mêmes inconnues, avec Zod (looseObject)
    [key: string]: unknown
}

/**
 * Récupère la collection Mongo (lazy)
 */
async function getLogsCollection() {
  const client = await getClient();
  return client.db().collection<LogDocument>("logs");
}

/**
 * Créer un log
 */
export async function createLog(
  log: createLogDTO
): Promise<InsertOneResult<LogDocument>> {
  const collection = await getLogsCollection();

  return collection.insertOne({
    ...log,
    // sécurité : si jamais le timestamp n’a pas été injecté
    timestamp: log.timestamp ?? new Date(),
  });
}

/**
 * Récupérer tous les logs
 */
export async function getLogs(): Promise<LogDocument[]> {
  const collection = await getLogsCollection();

  return collection.find().sort({ timestamp: -1 }).toArray();
}

/**
 * Récupérer un log par id
 */
export async function getLogById(
  id: string
): Promise<LogDocument | null> {
  const collection = await getLogsCollection();

  return collection.findOne({ _id: new ObjectId(id) });
}