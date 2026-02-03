import { Router } from "express";
import { getAuthedUserInfos, login, logout, refreshAccessToken, register } from "../controllers/auth.controller.ts";
import { checkRoles } from "../middlewares/accessControl.middleware.ts";

export const router = Router();

router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/logout', logout)
router.get('/auth/refresh', refreshAccessToken)
router.get('/auth/me', checkRoles(["member", "author", "admin"]), getAuthedUserInfos)
