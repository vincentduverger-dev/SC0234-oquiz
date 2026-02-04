import { Router } from "express";
import * as levelsController from "../controllers/levels.controller.ts";
import { checkRoles } from "../middlewares/accessControl.middleware.ts";

export const router = Router();

// Récupérer tous les levels
router.get("/levels", checkRoles(["member", "author", "admin"]), levelsController.getAllLevels);

// Récupérer un level par son identifiant
router.get("/levels/:id", checkRoles(['member', 'author', 'admin']), levelsController.getLevelById);

// Créer un level
router.post("/levels", checkRoles(['admin']), levelsController.createLevel);

// Modifier un level
router.put("/levels/:id", checkRoles(['admin']), levelsController.updateLevel);

// Supprimer un level
router.delete("/levels/:id", checkRoles(['admin']), levelsController.deleteLevel);