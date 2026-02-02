import type { Request, Response } from "express";
import z from "zod";
import { passwordSchema } from "../lib/validators.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";

export const register = async (req: Request, res: Response) => {
    // On crée un schéma (DTO - Data Transfer Object) pour valider les données entrantes dans notre controller
    const registerBodySchema = z.object({
        firstname: z.string().min(1),
        lastname: z.string().min(1),
        email: z.email(),
        password: passwordSchema,
        passwordConfirm: passwordSchema,
    })

    // 1 - valider et récupérer les informations du client
    const { firstname, lastname, email, password, passwordConfirm } = registerBodySchema.parse(req.body)

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