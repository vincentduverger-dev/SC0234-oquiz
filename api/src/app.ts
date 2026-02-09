// MW Npm
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
// MW custom
import { router as apiRouter } from "./routers/index.router.ts";
import { infoMiddleware } from "./middlewares/info.middleware.ts";
import { globalErrorHandler } from "./middlewares/globalError.middleware.ts";
import { notFoundMW } from "./middlewares/notFound.middleware.ts";
import { logRequest } from "./middlewares/requestLogger.middleware.ts";

// Créer une app Express
export const app = express();

// Helmet (MW qui définit les headers de sécurité)
// ! On le place au plu shaut niveau possible dans la queue des MW
app.use(helmet())

// Autorisation CORS
app.use(cors());

// Pour parser les cookies
app.use(cookieParser())

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

// XSS Sanitizer : va sanitize les données du body = nettoyer tout code malveillant injecté dans le body (balises script, instructions SQL ...)
// ! On le place juste après notre body parser (pour qu'il puisse lire le contenu du body)
app.use(xss());

// -----------------TOUS LES MW SUPPLEMENTAIRES SERONT A PLACER A PARTIR D ICI----------------

// Vu qu'on veut log toutes les requête dès qu'elles rentren sur le serveur, on pose le MW ici
app.use(logRequest)

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
