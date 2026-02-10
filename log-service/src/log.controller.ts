import type { Request, Response, NextFunction } from "express";
import { createLogSchema } from "./validators/logs.ts";
import { createLog, getLogs, getLogById } from "./log.service.ts";
import z from "zod";

/**
 * POST /api/logs
 */
export const createLogHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  // parseAsync si tu préfères rester async partout (équivalent à parse ici)
  const parsed = await createLogSchema.parseAsync(req.body);

  // Enrichissement serveur (énoncé)
  const toInsert = {
    ...parsed,
    timestamp: parsed.timestamp ?? new Date(),
    environment: parsed.environment ?? "development",
  };

  const result = await createLog(toInsert);

  res.status(201).json({
    id: result.insertedId,
    ...toInsert,
  });
};

/**
 * GET /api/logs
 */
export const getLogsHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const logs = await getLogs();
  res.status(200).json(logs);
};

/**
 * GET /api/logs/:id
 */
export const getLogByIdHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  // Validation params (tu faisais déjà ça : on garde)
  const { id } = await z
    .object({ id: z.string().min(1) })
    .parseAsync(req.params);

  const log = await getLogById(id);

  if (!log) {
    res.status(404).json({ error: "Log not found" });
    return;
  }

  res.status(200).json(log);
};