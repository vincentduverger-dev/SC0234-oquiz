import { Router } from "express";
import { login, register } from "../controllers/auth.controller.ts";

export const router = Router();

router.post('/register', register)
router.post('/login', login)