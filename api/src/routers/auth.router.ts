import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/auth.controller.ts";

export const router = Router();

router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/logout', logout)
router.get('/auth/refresh', refreshAccessToken)