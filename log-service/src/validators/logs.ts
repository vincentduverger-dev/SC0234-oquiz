import z from "zod";

export const LogLevelSchema = z.enum([
  "error",
  "warn",
  "info",
  "http",
  "verbose",
  "debug",
  "silly",
]);

// Schéma Zod pour les logs entrants
export const createLogSchema = z.looseObject({
  timestamp: z.coerce.date().default(() => new Date()),
  level: LogLevelSchema,
  message: z.string().min(1, "Message trop court").max(1000, "Message trop long"),
  service: z
    .string()
    .min(1, "Le nom du service est requis")
    .max(100, "Service trop long"),

  environment: z.string().max(50).default("development"),
  version: z.string().max(50).optional(),

  userId: z.string().max(100).optional(),
  requestId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  hostname: z.string().max(255).optional(),
  ip: z.string().optional(),
  userAgent: z.string().max(1000).optional(),

  metadata: z.unknown().optional(),
  stackTrace: z.string().max(50_000).optional(),
});

export type createLogDTO = z.infer<typeof createLogSchema>;