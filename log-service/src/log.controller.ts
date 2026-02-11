// On va créer une interface pour "typer" au mieux nos logs
// ! On utilise mongoDB, le but est donc de bénéficier des avantages de Mongo et donc de garder une structure flexible

import type { NextFunction, Request, Response } from "express";
import * as LogService from "./log.service.ts";
import { createLogSchema } from "./validators/logs.ts";
import z from "zod";


export const createLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // On s'assure que les données entrantes via req.body respectent certaines règles -> validateur schéma zod

    // Pour les propriétés connues -> zod va s'assurer qu'elles respectent les règles énoncées dans le schéma

    // Si il y a des propriétés inconnues -> elles ne seront pas validées (aucune règles spécifiées vu qu'elles sont inconnues) mais zod va les laisser passer et nous les retourner dans l'objet `parsedLog` grâce à l'utilisation dans le schéma de `z.looseObject`
    const parsedLog = await createLogSchema.parseAsync(req.body)

    // On va mettre le code relatif à la BDD dans un service dédié, et on appelle les méthodes depuis le controller
    const created = await LogService.insert(parsedLog)

    res.status(201).json(created)
}


export const getLogs = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {

  const schema = z.object({
    service: z.string().min(1).optional(),
    level: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
    userId: z.string().min(1).optional(),
    requestId: z.string().min(1).optional(),
    sessionId: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(1000).default(5),
    offset: z.coerce.number().int().min(0).default(0),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  });

  const parsed = await schema.parseAsync(req.query);

  const result = await LogService.getLogsPaginated({
    service: parsed.service,
    level: parsed.level,
    environment: parsed.environment,
    userId: parsed.userId,
    requestId: parsed.requestId,
    sessionId: parsed.sessionId,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    limit: parsed.limit,
    offset: parsed.offset,
  });

  res.status(200).json(result);
};

export const getOneLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Il faut qu'on récupère l'id
    const { id } = await z.object({ id: z.string().min(1) }).parseAsync(req.params)
    // Erreur si pas présent
    if (!id) {
        throw new Error("Id manquant")
    }

    const log = await LogService.findOneById(id)
    res.json(log)
}

/**
 * POST /api/logs/batch
 */
export const createBatchHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {

  const schema = z.object({
    data: z.array(createLogSchema).min(1).max(1000)
  });

  const parsed = await schema.parseAsync(req.body);

  const result = await LogService.createBatch(parsed.data);

  res.status(201).json({
    insertedCount: result.insertedCount
  });
};