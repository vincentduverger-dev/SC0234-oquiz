import type { Request, Response } from "express";
import z from "zod";
import { passwordSchema } from "../lib/validators.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { config } from "../../config.ts";
import crypto from 'node:crypto'
import { BadRequestError, UnauthorizedError } from "../lib/errors.ts";

// On pourrait laisser TS inférer le type de retour du controller (Promise<void>) mais le fait de le marquer explicitement, verrouille le comportement du controller et le rend prévisible.
// Si dans le controller je fait `return 123` -> Erreur TS
export const register = async (req: Request, res: Response): Promise<void> => {
    // On crée un schéma (DTO - Data Transfer Object) pour valider les données entrantes dans notre controller
    const registerBodySchema = z.object({
        firstname: z.string().min(1),
        lastname: z.string().min(1),
        email: z.email(),
        password: passwordSchema,
        passwordConfirm: passwordSchema,
    })

    // 1 - valider et récupérer les informations du client
    const { firstname, lastname, email, password, passwordConfirm } = await registerBodySchema.parseAsync(req.body)

    // 1.1 - s'assurer que les password correspondent
    if (password !== passwordConfirm) {
        throw new Error('Les mdp ne correspondent pas')
    }

    // 2 - avant de créer un user, s'assurer qu'il n'existe pas déjà
    const alreadyExistingUser = await prisma.user.findFirst({ where: { email } })
    // S'il existe -> Erreur
    if (alreadyExistingUser) {
        throw new Error('Un user avec cet email existe déjà')
    }

    // 3 on peut créer le nouveau user
    // ! Sans enregistrer son mdp en DB
    // 3.1 hasher le mdp

    // pas besoin de typer la const hash -> la méthode .hash() de argon2 est déjà typée (=> Promise<string>) donc TS va automatiquement déduire que hash est de type string => c'est ce qu'on appelle l'inférence
    const hash = await argon2.hash(password)

    // 3.2 on enregistre dans la db
    const createdUser = await prisma.user.create({
        data: {
            firstname,
            lastname,
            email,
            password: hash
        }
    })

    res.status(201).json({
        message: "OK", user: {
            id: createdUser.id,
            email: createdUser.email,
            firstname: createdUser.firstname,
            lastname: createdUser.lastname,
            created_at: createdUser.created_at,
            updated_at: createdUser.updated_at,
        }
    })
}

export const login = async (req: Request, res: Response): Promise<void> => {
    // 1 - validation des données entrantes
    const loginBodySchema = z.object({
        email: z.email(),
        password: passwordSchema,
    })

    const { email, password } = await loginBodySchema.parseAsync(req.body)

    // 2 - récupérer les infos user (et vérifier s'il existe)
    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
        throw new BadRequestError("Combinaison email/mdp incorrecte")
    }

    // 3 - comparer le hash BDD avec le mdp fourni
    const isMatching = await argon2.verify(user.password, password)

    if (!isMatching) {
        throw new BadRequestError("Combinaison email/mdp incorrecte")
    }

    // 4 - créer un JWT avec les infos du user

    // 4.1 définir le payload
    const payload = {
        userId: user.id,
        role: "member"
    }

    // 4.2 génèrer un access token et le signer avec notre SECRET

    const TOKEN_EXPIRES_IN_MS = 1 * 60 * 60 * 1000 // 1h en ms

    const tokenJWT = jwt.sign(payload, config.jwt_secret, { expiresIn: '1h' })

    const token = {
        token: tokenJWT,
        expiresAt: new Date(new Date().valueOf() + TOKEN_EXPIRES_IN_MS),
        type: 'Bearer'
    }

    // on génère un refreshToken
    const refreshToken = crypto.randomBytes(128).toString("base64");

    // 4.3 envoyer le token au client

    // SOIT dans les cookies
    res.cookie(`accessToken`, token.token, {
        httpOnly: true,

        // Pour des cookies sécurisés cross-origin il faut :
        secure: config.isProduction,    // les cookies cross-origin, c'est seulement en HTTPS ! Pour le dev on autorisera le HTTP en se basant sur la variable NODE_ENV
        sameSite: config.isProduction ? "none" : "lax", // "none" nécessite secure=true
        maxAge: TOKEN_EXPIRES_IN_MS, // expiration du cookie en même temps que le JWT
        path: "/api" // -> le cookie ne s'enverra que sur les requêtes "http://localhost:3000/api"
    });

    // SOIT directement dans la response
    res.status(200).json({ message: "OK", token: tokenJWT, refreshToken })
}