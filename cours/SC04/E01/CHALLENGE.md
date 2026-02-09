# Challenge

Comme toujours :

- Gitflow
- Créer une branche
- Pull Request pour demander des feedbacks

MongoDB :

- Challenge exploratoire : se renseigner sur les spécificités de MongoDB et pourquoi on l'utilise ici pour notre service de logs ?

---

## Exercice n°1 : Architecture du projet

En suivant la structure de projet suivante, créer les fichiers nécessaires :

- `index.ts` : point d'entrée du serveur
- `src/app.ts` : configuration de l'application Express
- `src/routes/index.ts` : fichier de routage principal
- `src/routes/logs.routes.ts` : routes pour les logs
- `src/controllers/log.controller.ts` : contrôleur pour les logs
- `src/services/logs.service.ts` : service pour les logs (création, lecture, mise à jour, suppression des logs en BDD)
- `src/lib/db.ts` : utilitaires pour la connexion à la base de données MongoDB

Initialiser express et les middlewares nécessaires.

---

## Exercice n°2 : Service pour les logs

Dans le fichier `src/services/logs.service.ts`, créer un service pour les logs avec les fonctionnalités suivantes :

- Création d'un log : `createLog`
- Récupération d'un log par identifiant : `getLogById`
- Récupération de logs : `getLogs`

Ne pas hésitez à créer les schéma zod nécessaires pour en extraire les types de données nécessaires.
Utiliser le client mongodb (voir [lib/db.ts](../../../logs-service/src/lib/db.ts)) pour faire les requêtes.

---

## Exercice n°3 : Création de logs

- Endpoint pour créer un log unitaire : `POST /api/logs`
  - Corps attendu minimal : `level`, `message`, `service`
  - Champs optionnels acceptés : `version`, `environment`, `userId`, `requestId`, `sessionId`, `hostname`, `ip`, `userAgent`, `metadata`, `stackTrace`, `timestamp`
  - Le serveur enrichit automatiquement : `timestamp` (date courante) et `environment` (défaut à `development`).
  - Les propriétés non prévues par le schéma doivent être prise en compte (`passthrough` avec `zod`)

Exemples de payloads :

Payload minimal `POST /api/logs`:

```json
{
  "level": "info",
  "message": "Utilisateur connecté",
  "service": "auth"
}
```

Payload complet `POST /api/logs`:

```json
{
  "level": "error",
  "message": "Exception non gérée",
  "service": "orders",
  "version": "1.4.2",
  "environment": "production",
  "userId": "u_123",
  "requestId": "req_456",
  "sessionId": "sess_789",
  "hostname": "api-1",
  "ip": "203.0.113.10",
  "userAgent": "Mozilla/5.0 ...",
  "metadata": { "orderId": "ord_42", "retry": true },
  "stackTrace": "Error: ..."
}
```
