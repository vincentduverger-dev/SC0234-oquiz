import { Router } from "express";
import * as tagsController from "../controllers/tags.controller.ts";
import { checkRoles } from "../middlewares/accessControl.middleware.ts";
import { checkSelfItem } from "../middlewares/checkSelfItem.middleware.ts";

export const router = Router();

// Documentation Swagger : voir /api/src/swagger/endpoints/tags.json
router.get("/", checkRoles(["member", "author", "admin"]), tagsController.getAllTags);
router.get("/:id", checkRoles(["member", "author", "admin"]), tagsController.getOneTag);
router.post("/", checkRoles(["author", "admin"]), tagsController.createTag);
router.patch("/:id", checkRoles(["author", "admin"]), checkSelfItem('tag', ['admin']), tagsController.updateTag);
router.delete("/:id", checkRoles(["author", "admin"]), checkSelfItem('tag', ['admin']), tagsController.deleteTag);
