// On va créer une interface pour "typer" au mieux nos logs
// ! On utilise mongoDB, le but est donc de bénéficier des avantages de Mongo et donc de garder une structure flexible

import type { NextFunction, Request, Response } from "express";
import { getClient } from "./lib/db.ts";
import * as LogService from "./log.service.ts";
import { createLogSchema } from "./validators/logs.ts";
import z from "zod";

export interface LogDocument {
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

// const doc: LogDocument = {
//     timestamp: new Date(),
//     level: "string",
//     message: "string",
//     service: "string",
//     pid: 1454,

// Je peux rajouter des propriétés non définies sur mon interface
//     name: "alice",
//     nimportequoi : 123,
//     nirtequoi : "oiii"
// }


export const createLog = async (req: Request, res: Response, next: NextFunction) => {
    // On s'assure que les données entrantes via req.body respectent certaines règles -> validateur schéma zod

    // Pour les propriétés connues -> zod va s'assurer qu'elles respectent les règles énoncées dans le schéma

    // Si il y a des propriétés inconnues -> elles ne seront pas validées (aucune règles spécifiées vu qu'elles sont inconnues) mais zod va les laisser passer et nous les retourner dans l'objet `parsedLog` grâce à l'utilisation dans le schéma de `z.looseObject`
    const parsedLog = await createLogSchema.parseAsync(req.body)

    // On va mettre le code relatif à la BDD dans un service dédié, et on appelle les méthodes depuis le controller
    const created = await LogService.insert(parsedLog)

    res.status(201).json(created)
}


export const getLogs = async (req: Request, res: Response, next: NextFunction) => {
    const logs = await LogService.findAll()
    res.json(logs)
}

export const getOneLogById = async (req: Request, res: Response, next: NextFunction) => {

    // Il faut qu'on récupère l'id
    const { id } = await z.object({ id: z.string().min(1) }).parseAsync(req.params)
    // Erreur si pas présent
    if (!id) {
        throw new Error("Id manquant")
    }

    const log = await LogService.findOneById(id)
    res.json(log)
}