import { createLogger, format, transports } from "winston";
import { config } from "../../config.ts";
import path from "path";

export const logger = createLogger({
    // On définit le niveau minimal de logs qu'on veut gérer = le niveau choisi + ceux supérieurs 
    // https://www.npmjs.com/package/winston#logging-levels
    level: config.isProduction ? 'http' : 'debug',
    // On peut spécifier un format pour nos logs = les infos qu'on va vouloir y faire apparaître
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, message, level, ...meta }) => {
            return JSON.stringify({
                timestamp, level, message, ...meta
            })
        })
    ),
    // Transports = Spécifier où atterit notre log une fois créé ?
    // On indique une liste de nos différents transports
    transports: [
        new transports.File({
            level: 'error', // niveau minimal des erreurs dans ce fichier -> que mes logs d'erreur
            filename: path.join(config.logs_path, 'errors.log') // filename = en réalité c'est le path complet -> les dossiers inexistants seront créés par Winston
        }),
        new transports.File({
            filename: path.join(config.logs_path, 'combined.log'), // filename = en réalité c'est le path complet -> les dossiers inexistants seront créés par Winston
            maxsize: 5242880, // 5MB
            maxFiles: 5, // Winston va gérer automatiquement la création de nouveaux fichiers lorsque les prcédents excèdent la maxsize, et supprime rle plus ancien si on atteitn le maxFiles
            tailable: true // autorise winston à écraser les anciens fichiers
        })
    ],
    // Gestionnaires pour les erreurs non gérées, non capturées
    exceptionHandlers: [new transports.File({ filename: path.join(config.logs_path, 'exceptions.log') })],
    // Gestionnaires pour les promises rejected
    rejectionHandlers: [new transports.File({ filename: path.join(config.logs_path, 'rejections.log') })]
})


if (process.env.NODE_ENV === 'development') {
    logger.add(
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.printf(({ timestamp, level, message, stack, ...meta }) => {
                    const metaString = Object.keys(meta).length
                        ? JSON.stringify(meta, null, 2)
                        : '';
                    const stackString = stack ? `\n${stack}` : '';
                    return `${timestamp} [${level}]: ${message}${stackString}${metaString ? `\n${metaString}` : ''
                        }`;
                })
            ),
        })
    );
}
