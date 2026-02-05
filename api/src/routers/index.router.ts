import { Router } from "express";
import { router as usersRouter } from "./users.router.ts";
import { router as levelRouter } from "./levels.router.ts";
import { router as authRouter } from "./auth.router.ts";
import { router as tagRouter } from "./tags.router.ts";


export const router = Router();

router.use(usersRouter);
router.use(levelRouter);
router.use(authRouter);
router.use('/tags', tagRouter)