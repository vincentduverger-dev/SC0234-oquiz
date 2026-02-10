import z from "zod";

export const LogLevelSchema = z.enum([
    'error',
    'warn',
    'info',
    'http',
    'verbose',
    'debug',
    'silly',
]);

// On se crée un schema zod pour parser les logs entrants (les logs à créer dans la db)

// looseObject permet de laisser passer les propriétés supplémentaires non définies dans le schéma, parfait pour nos logs dont la structure est flexible et pour mongoDB
export const createLogSchema = z.looseObject({
    timestamp: z.coerce.date().default(() => new Date()),
    level: LogLevelSchema,
    message: z.string().min(1, 'Message trop court').max(1000, 'Message trop long'),
    service: z.string().min(1, 'Le nom du service est requis').max(100, 'Service trop long'),
    environment: z.string().max(50).default('development'),
    version: z.string().max(50).optional(),
    userId: z.string().max(100).optional(),
    requestId: z.string().max(100).optional(),
    sessionId: z.string().max(100).optional(),
    hostname: z.string().max(255).optional(),
    ip: z.string().optional(),
    userAgent: z.string().max(1000).optional(),
    stackTrace: z.string().max(50000).optional(),
})