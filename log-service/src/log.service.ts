import { ObjectId, type InsertOneResult, type InsertManyResult,  type Filter } from "mongodb"
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


// On récupère 1 seule fois le client db pour toutes les méthodes du service
const client = await getClient()
// On préconfigure collection avec : la db, la bonne collection et le typage sur la collection, ça nous permettra d'être tranquille pour le typage
const collection = client.db().collection<LogDocument>('logs')



export const insert = async (log: createLogDTO): Promise<InsertOneResult<LogDocument>> => {
    // On reçoit un logque le controller aura déjà validé (avec le schéma zod)
    // Le seul rôle u service est de faire l'enregistrement en BDD et de retourner le résultat
    return await collection.insertOne(log)
}

export const findAll = async (): Promise<LogDocument[]> => {
    // .find() crée un curseur -> une prérecherche des résultats du find, pour exécuter la recherche et récupérer les résultats du curseur, il faut utiliser.toArray()
    return await collection.find().toArray()
}

export const findOneById = async (id: string): Promise<LogDocument | null> => {
    return await collection.findOne({ _id: new ObjectId(id) })
}

export const createBatch = async (
  logs: createLogDTO[]
): Promise<InsertManyResult<LogDocument>> => {
  return collection.insertMany(logs);
};

export type GetLogsQuery = {
  service?: string;
  level?: string;
  environment?: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
  startDate?: Date;
  endDate?: Date;
  limit: number;
  offset: number;
};

export type GetLogsResult = {
  data: LogDocument[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export const getLogsPaginated = async (
  query: GetLogsQuery
): Promise<GetLogsResult> => {
  const {
    service,
    level,
    environment,
    userId,
    requestId,
    sessionId,
    startDate,
    endDate,
    limit,
    offset,
  } = query;

  const filter: Filter<LogDocument> = {};

  if (service) filter.service = service;
  if (level) filter.level = level;
  if (environment) filter.environment = environment;
  if (userId) filter.userId = userId;
  if (requestId) filter.requestId = requestId;
  if (sessionId) filter.sessionId = sessionId;

  if (startDate || endDate) {
    filter.timestamp = {
      ...(startDate ? { $gte: startDate } : {}),
      ...(endDate ? { $lte: endDate } : {}),
    } as any;
  }

  const total = await collection.countDocuments(filter);

  const data = await collection
    .find(filter)
    .sort({ timestamp: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  return {
    data,
    pagination: {
      total,
      limit,
      offset,
      hasNext: offset + limit < total,
      hasPrevious: offset > 0,
    },
  };
};