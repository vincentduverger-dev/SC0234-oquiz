import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../lib/errors.ts";

// On redirige les Notfound vers le GlobalErrorMW
export const notFoundMW = (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError("Ressource not found"));
};