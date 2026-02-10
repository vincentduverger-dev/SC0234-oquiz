import { Router } from "express";
import { createLog } from "./log.controller.ts";

export const logRouter = Router()

logRouter.post('/', createLog)