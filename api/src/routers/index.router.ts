import { Router } from "express";
import swaggerUi from 'swagger-ui-express';

import { router as usersRouter } from "./users.router.ts";
import { router as levelRouter } from "./levels.router.ts";
import { router as authRouter } from "./auth.router.ts";
import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { router as tagRouter } from "./tags.router.ts";


export const router = Router();

router.use(usersRouter);
router.use(levelRouter);
router.use(authRouter);

const spec = swaggerJSDoc({
    definition: {
        info: {
            title: 'Oquiz',
            version: '1.0.0',
        },
        basePath: "/api"
    },
    apis: [path.join(import.meta.dirname, '*.router.ts')]
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
router.use('/tags', tagRouter)
