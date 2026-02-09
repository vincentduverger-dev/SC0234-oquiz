import type { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'node:crypto'
import { logger } from '../lib/logger.ts'

// L'idée de ce middleware est de récupérer un maximum d'infos utiles sur une requête entrante dans le service afin de monitorer le fonctionnement de notre application
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    // On veut identifier chaqeu requête entrante

    // Soit :
    // - la requête a déjà un ID (elle provient d'un autre service qui lui en a attribué un)
    // - elle n'en a pas -> on en gènère un random
    const id = req.requestId || randomUUID()

    // On va vouloir accéder à cet ID à différents "endroits" :

    // 1 - le code applicatif (controllers, MWs....)
    req.requestId = id

    // 2 - le client (ex : appel au support "quel est l'identifiant de votre requête ?")
    res.setHeader('x-request-id', id) // "x-" = eXtension => pour indiquer que c'est un header custom

    // 3 - pour le logger
    // On génère une instance de notre logger, configurée avec le requestId propre à la requête actuelle
    // https://github.com/winstonjs/winston?tab=readme-ov-file#creating-child-loggers
    const childLogger = logger.child({ requestId: id })

    // On attache le child logger à la request, ainsi on utilisera req.logger.log()
    req.logger = childLogger


    // On va définir les infos utiles que notre MW voudra logger

    // on va calculer le temps de réponse du serveur pour la request
    // on utilise hrtime.bigint() car précision à la nanoseconds -> plus pertinent pour mesurer des temps d'exécution serveur
    const start = process.hrtime.bigint()


    // On définit un callback sur la response, il sera appelé lorsque la response sera "finish" -> res.end() ou res.json()
    res.on('finish', () => {
        const durationMS = Number(process.hrtime.bigint() - start) / 1e6; // On reconverti en MS avec virgule flottante -> 2.645ms
        req.logger.http('HTTP request', {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            status: res.statusCode,
            useragent: req.get('user-agent'),
            durationMS
        })
    })

    next()
}