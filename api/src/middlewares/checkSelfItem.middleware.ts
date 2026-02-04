/**
 * @fileoverview Middleware de vérification de propriété d'une ressource
 *
 * Ce middleware vérifie si l'utilisateur authentifié est bien le propriétaire
 * de la ressource qu'il tente de modifier ou supprimer (PATCH & DELETE).
 * Certains rôles (ex: admin) peuvent être exemptés de cette vérification.
 */

import type { NextFunction, Request, Response } from "express";
import { prisma, type Role } from "../models/index.ts";
import { ForbiddenError, UnauthorizedError } from "../lib/errors.ts";

/**
 * Type Union Literal - Définit les noms des modèles Prisma possédant un `author_id`.
 *
 * En TypeScript, un "Type Alias" permet de créer un type personnalisé.
 * Ici on utilise un "Union Type" avec des "Literal Types" (valeurs exactes).
 *
 * Cela signifie que `ModelWithAuthorKey` ne peut valoir QUE "quiz" OU "tag".
 * Toute autre chaîne provoquera une erreur de compilation TypeScript.
 *
 * @example
 * const valid: ModelWithAuthorKey = "quiz";  // ✅ OK
 * const invalid: ModelWithAuthorKey = "user"; // ❌ Erreur TS
 */
type ModelWithAuthorKey = "quiz" | "tag";

/**
 * Factory function qui retourne un middleware Express.
 *
 * C'est un pattern "Higher-Order Function" : une fonction qui retourne une fonction.
 * Cela permet de configurer le middleware avec des paramètres (`item`, `exceptRoles`)
 * tout en conservant la signature standard d'un middleware Express.
 *
 * @param item - Le nom du modèle Prisma à interroger.
 *               Grâce au type `ModelWithAuthorKey`, TypeScript garantit qu'on ne peut
 *               passer que "quiz" ou "tag", évitant les fautes de frappe à la compilation.
 *
 * @param exceptRoles - Tableau de rôles exemptés de la vérification.
 *                      Le type `Role` est importé depuis Prisma (type généré automatiquement
 *                      depuis le schema.prisma), garantissant que seuls les rôles valides
 *                      définis dans l'enum Prisma peuvent être utilisés.
 *
 * @returns Un middleware Express async conforme à la signature (req, res, next)
 */
export const checkSelfItem = (item: ModelWithAuthorKey, exceptRoles: Role[]) => {
    /**
     * Le middleware retourné.
     * 
     * Signature classique d'un MW Express : (Request, Response, NextFunction) => {}
     */
    return async (req: Request, res: Response, next: NextFunction) => {

        /**
         * Vérification de l'authentification.
         *
         * `req.user?.role` utilise l'Optional Chaining (`?.`) de TypeScript/JS.
         * Si `req.user` est undefined/null, l'expression retourne undefined
         * au lieu de lever une erreur "Cannot read property 'role' of undefined".
         *
         * Le type de `req.user` est défini via "Declaration Merging" dans
         * `@types/express/index.d.ts`, où on étend l'interface Request d'Express
         * pour y ajouter notre propriété `user`.
         */
        if (!req.user?.role) {
            throw new UnauthorizedError('You have to be logged in to access this resource');
        }

        /**
         * Bypass pour les rôles exemptés (ex: admin).
         *
         * `exceptRoles.includes()` vérifie si le rôle du user est dans la liste.
         * Grâce au typage `Role[]`, TypeScript s'assure que seuls des rôles valides
         * peuvent être dans ce tableau.
         */
        if (exceptRoles.includes(req.user?.role)) {
            return next();
        }

        const itemId = req.params.id;
        const userId = req.user?.userId;

        /**
         * Requête Prisma dynamique.
         *
         * `prisma[item]` accède dynamiquement au modèle Prisma.
         * Ex: si item="quiz", cela équivaut à `prisma.quiz`
         *
         * Le cast `as any` est nécessaire ici car TypeScript ne peut pas
         * inférer dynamiquement le type retourné par `prisma[item]`.
         * C'est un compromis : on perd le typage fort sur cette ligne
         * mais on gagne en flexibilité (un seul middleware pour plusieurs modèles).
         *
         * Alternative plus typée : utiliser des génériques ou un switch/case,
         * mais cela complexifierait le code pour un gain limité ici.
         */
        const itemPrisma = await (prisma[item] as any).findUnique({
            where: { id: parseInt(itemId as string) },
        });

        /**
         * Vérification de propriété.
         *
         * `itemPrisma?.author_id` : encore l'Optional Chaining pour gérer
         * le cas où l'item n'existe pas en base (findUnique retourne null).
         */
        if (userId !== itemPrisma?.author_id) {
            throw new ForbiddenError("Seul l'auteur de la ressource peut effectuer cette action")
        }

        /**
         * Optimisation : on attache l'item récupéré à la requête.
         *
         * `req.itemData` est une propriété custom ajoutée via Declaration Merging
         * dans `@types/express/index.d.ts`. Cela évite de refaire une requête
         * Prisma identique dans le controller.
         *
         * Le type de `itemData` devrait idéalement être défini comme un union
         * des types possibles (Quiz | Tag) pour un typage complet.
         */
        req.itemData = itemPrisma;

        return next();
    };
};