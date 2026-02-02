import cors from "cors";
import express from "express";
import { router as apiRouter } from "./routers/index.router.ts";
import { infoMiddleware } from "./middlewares/info.middleware.ts";
import { globalErrorHandler } from "./middlewares/globalError.middleware.ts";
import { notFoundMW } from "./middlewares/notFound.middleware.ts";

// Créer une app Express
export const app = express();

// Autorisation CORS
app.use(cors());

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

// Brancher le routeur de l'API
app.use("/api", apiRouter);

// Info route
app.get("/info", infoMiddleware);





// -----------------------GESTION DES ERREURS-----------------

// Middleware notFound
app.use(notFoundMW);

// Middleware erreurs
// Sera appelé dès qu'une erreur est `throw` dans les MW précédents
app.use(globalErrorHandler);
