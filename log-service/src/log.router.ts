import { Router } from "express";
import {
  createLogHandler,
  getLogsHandler,
  getLogByIdHandler,
} from "./log.controller.js";

export const logRouter = Router();

// POST /api/logs
logRouter.post("/", createLogHandler);

// GET /api/logs
logRouter.get("/", getLogsHandler);

// GET /api/logs/:id
logRouter.get("/:id", getLogByIdHandler);