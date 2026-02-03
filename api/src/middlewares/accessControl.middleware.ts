import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../lib/errors.ts";
import type { TokenPayload } from "../lib/tokens.ts";
import { config } from "../../config.ts";
import jwt from 'jsonwebtoken'
import type { Role } from "../models/index.ts";



export const checkRoles = (roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("ACCESS CONTROL MW");

        // 1 - vérifier le rôle du user connecté => JWT
        const accessToken = extractAccessToken(req)

        // 2 - valider le token et récupérer le role du user connecté
        const tokenPayload = validateJWT(accessToken)

        // 3 - vérifier si le role du user correspond aux roles néecessaires pour accéder à la ressource (définis directement sur la route)
        if (!roles.includes(tokenPayload.role)) {
            throw new ForbiddenError("Permission denied")
        }

        /**
        * 4 - On pense au controller et aux principes DRY
        * -> On va éviter au controller d'avoir à refaire les étapes de validation + décodage du token et * lui fournir directement les infos du user
        * => on surcharge l'objet `req` avec les infos du user
        */

        req.user = tokenPayload

        // On passe le relai au controller
        next()
    }
}


const extractAccessToken = (req: Request) => {
    // 1 - vérifier le rôle du user connecté => JWT
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken
    }

    if (req.headers.authorization) {
        if (req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1]
        }
    }

    throw new UnauthorizedError('Token not provided')
}

const validateJWT = (token: string) => {
    try {
        // 2 - valider le JWT
        // On s'assure de l'intégrite de la signature du JWT
        // On s'assure qu'il n'est pas expiré
        // 1.3 décoder le JWT pour lire le userId

        // On va utiliser la méthode `verify()` de jsonwebtoken qui s'assure de tout ça
        // Si le token n'est pas valide (signature ou expiration) verify() lève une erreur
        const payload: TokenPayload = jwt.verify(token, config.jwt_secret) as TokenPayload;
        return payload;
    } catch (error) {
        throw new UnauthorizedError("Invalid token")
    }
}