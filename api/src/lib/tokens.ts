import jwt from "jsonwebtoken";
import { config } from "../../config.ts";
import type { Role, User } from "../../prisma/generated/client.ts";
import crypto from 'node:crypto';

// On va typer les objets qu'on manipule et retourne avec la fonction generateAuthTokens

export interface Token {
    token: string;
    type: string;
    expiresInMs: number;
}

export interface TokenPayload {
    userId: number;
    role: Role;
}



export const ACCESS_TOKEN_EXPIRES_IN_MS = 1 * 60 * 60 * 1000 // 1h
export const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7j

export const generateAuthTokens = (user: User): { accessToken: Token, refreshToken: Token } => {

    // 1 on défini les infos qu'on va vouloir insérer dans le payload du token
    const payload: TokenPayload = {
        userId: user.id,
        role: user.role
    }
    // 2 on crée et signe le accessToken avec jwt.sign()
    const tokenJWT = jwt.sign(payload, config.jwt_secret, { expiresIn: "1h" })

    // 3 on génère un refreshToken
    const refreshToken = crypto.randomBytes(128).toString("base64");


    return {
        accessToken: {
            token: tokenJWT,
            type: 'Bearer',
            expiresInMs: ACCESS_TOKEN_EXPIRES_IN_MS
        },
        refreshToken: {
            token: refreshToken,
            type: 'Bearer',
            expiresInMs: REFRESH_TOKEN_EXPIRES_IN_MS
        }
    }
}