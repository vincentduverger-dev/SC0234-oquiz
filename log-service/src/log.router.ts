import { Router } from "express";
import { createLog, getLogs, getOneLogById } from "./log.controller.ts";

export const logRouter = Router()

logRouter.post('/', createLog)
logRouter.get('/', getLogs)
logRouter.get('/:id', getOneLogById)