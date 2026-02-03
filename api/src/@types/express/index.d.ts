import type { TokenPayload } from "../../lib/tokens.ts"
import type { Prisma } from "../../models/index.model.ts"
import type { logger } from '../../lib/logger.ts'


// Ici on étend la définition de type de l'objet Request de Express afin de pouvoir y insérer notre user lors du décodage du JWT


// Approche n°1 : on surchage au global ce qu'il se trouve dans Express.Request
// Avantage : on continue à `import { Request } from "express"` dans les controlleurs comme d'hab
// Inconvénient : on peut accéder à `req.user` même sur les controlleurs qui n'auraient pas le checkRoles (ex : routes publiques)
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId?: TokenPayload["userId"]
                role?: TokenPayload["role"]
            }
        }
    }
}

// Approche n°2 : créer une interface qui étend Express.Request
// Avantage : plus explicite
// Inconvénient (mineur) : on doit importer `AuthenticatedRequest` dans les controlleurs plutot que Request
// export interface AuthenticatedRequest extends Request {
//     user: {
//         userId?: TokenPayload["userId"]
//         role?: TokenPayload["role"]
//     }
//     itemData?: Prisma.JsonValue
// }