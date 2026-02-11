import { Router } from "express";
import { createLog, getLogs, getOneLogById, createBatchHandler } from "./log.controller.ts";

export const logRouter = Router()

logRouter.post('/', createLog)
logRouter.get('/', getLogs)
logRouter.get('/:id', getOneLogById)
logRouter.post("/batch", createBatchHandler);