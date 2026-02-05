import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import * as z from 'zod';
import { ConflictError, NotFoundError } from "../lib/errors.ts";

export const getAllLevels = async (_req: Request, res: Response) => {
  const levels = await prisma.level.findMany();

  // Je pense bien à `return` pour ne pas continuer l'exécution d ela fonction après le if, ce qui tenterait d'envoyer une 2e res (impossible)
  if (levels.length === 0) return res.json("Aucun résultat");

  return res.json(levels);
};

export const getLevelById = async (req: Request, res: Response) => {
  const id = await z.coerce.number().int().min(1).parseAsync(req.params.id);

  const level = await prisma.level.findUnique({ where: { id } });

  if (!level) throw new NotFoundError("Aucun level correspondant à cet id : " + id);

  return res.json(level);
};


export const createLevel = async (req: Request, res: Response) => {
  // On crée un schema (DTO) avec zod pour valider notre body
  const createLevelSchema = z.object({
    name: z.string()
  });

  const validatedData = await createLevelSchema.parseAsync(req.body);

  // Vérifier si le level n'existe pas déjà
  const existingLevel = await prisma.level.findUnique({ where: { name: validatedData.name } });

  if (!existingLevel) {
    const newLevel = await prisma.level.create({ data: { name: validatedData.name } });
    return res.json(newLevel);
  }

  throw new ConflictError("Le level existe déjà, level : " + existingLevel);
};

export const updateLevel = async (req: Request, res: Response) => {
  // On récupère l'id dans les params avec zod
  const id = await z.coerce.number().int().min(1).parseAsync(req.params.id);
  // On crée un schema (DTO) avec zod pour valider notre body
  const updateLevelSchema = z.object({
    name: z.string()
  });

  const validatedData = await updateLevelSchema.parseAsync(req.body);

  const level = await prisma.level.findUnique({ where: { id } });
  if (!level) throw new NotFoundError("Level non trouvé");

  const levelUpdate = await prisma.level.update({
    where: { id },
    data: validatedData,
  });

  return res.json(levelUpdate);
};

export const deleteLevel = async (req: Request, res: Response) => {
  const id = await z.coerce.number().int().min(1).parseAsync(req.params.id);

  const level = await prisma.level.findUnique({ where: { id } });
  if (!level) throw new NotFoundError("Level non trouvé");

  const deletedlevel = await prisma.level.delete({
    where: { id },
  });

  return res.json(deletedlevel);
};