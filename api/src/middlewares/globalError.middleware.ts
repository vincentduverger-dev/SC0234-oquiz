import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpClientError } from "../lib/errors.ts";


export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    // Ce MW sera appelé dans plusieurs cas :
    // - dans un MW en amont -> `next(error)`
    // - dans un MW en amont -> `throw new Error()` -> l'erreur sera automatiquement transmise ici

    // récupérer la stackTrace -> pour monitorer en dév
    const stacktraceObject = process.env.NODE_ENV === "development" ? { stack: error.stack } : {};

    // On va gérer et différencier différents tyes d'erreur
    // 1 - Gérer les erreurs de validation Zod - avec parse zod throw les erreurs potentielles, on les récupère ici
    if (error instanceof z.ZodError) {
        // On utilise le logger de la request pour avoir son requestId dans le log
        req.logger.info('ZodError', error)

        // 422 -> Unprocessable entity
        return res.status(422).json({
            status: 422,
            error: z.prettifyError(error),
            ...stacktraceObject
        });
    }

    // 2 - Erreur HTTP
    if (error instanceof HttpClientError) {
        req.logger.info('HttpError', error)
        // On retourne l'erreur avec ses propres attributs
        return res.status(error.status).json({
            status: error.status,
            error: error.message,
            ...stacktraceObject
        });
    }


    req.logger.error('ServerError', error)
    // Pour tous les autres cas d'erreur non gérés on renvoie une 500
    return res.status(500).json({
        error: "Internal server error",
        status: 500,
        ...stacktraceObject
    });
}