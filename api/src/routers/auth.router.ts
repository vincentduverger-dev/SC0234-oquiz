import { Router } from "express";
import { register } from "../controllers/auth.controller.ts";

export const router = Router();

router.post('/register', register)
// router.post('/login')