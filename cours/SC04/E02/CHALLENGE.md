# Challenge 02

## Exercice n°1 : Création par batch

- Endpoint de création de batch : `POST /api/logs/batch`
  - Corps attendu : `logs` (tableau de logs, max 1000)

```json
{
  "data": [
    {
      "_id": "689c8ceb6bc6683cb4e53433",
      "level": "info",
      "message": "mon message",
      "service": "api",
      "environment": "development",
      "timestamp": "2025-08-13T13:02:35.376Z",
      "toto": "lol"
    }
  ]
}
```

## Exercice n°2 : Lecture paginée/filtrée

- Lecture paginée/filtrée : `GET /api/logs` avec filtres optionnels
  - Query params attendu optionnels : `service`, `level`, `environment`, `userId`, `requestId`, `sessionId`, `limit`, `offset`, `startDate`, `endDate`
    - `service`, `level`, `environment`, `userId`, `requestId`, `sessionId` sont utilisés pour filtrer les logs par ces champs
    - `limit` et `offset` sont utilisés pour la pagination
    - `startDate` et `endDate` sont utilisés pour filtrer les logs par date (après la date de début et avant la date de fin)
      - format de date attendu : `YYYY-MM-DDTHH:MM:SS.SSSZ`
  - Retour attendu : `logs` (tableau de logs)

```json
{
  "data": [
    {
      "_id": "689c8ceb6bc6683cb4e53433",
      "level": "info",
      "message": "mon message",
      "service": "api",
      "environment": "development",
      "timestamp": "2025-08-13T13:02:35.376Z",
      "toto": "lol"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 5,
    "offset": 0,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

## Exercice n°3 : Lecture par identifiant (affiner la validation)

- Lecture par identifiant : `GET /api/logs/:id`
- Validation avec zod de l'id (Vérifier que l'id est un ObjectId valide, voir `refine` + `ObjectId.isValid`)

```json
{
  "data": {
    "_id": "689c8ceb6bc6683cb4e53433",
    "level": "info",
    "message": "mon message",
    "service": "api",
    "environment": "development",
    "timestamp": "2025-08-13T13:02:35.376Z",
    "toto": "lol"
  }
}
```

## Exercice n°4 (BONUS) : Statistiques

- Endpoint de statistiques : `GET /api/logs/stats`
  - Query params attendu : `service`, `environment`, `startDate`, `endDate`
  - Retour attendu : `totalLogs`, `logCountByLevel`, `logCountByService`, `logCountByEnvironment`
    - Utiliser l'aggrégation MongoDB pour calculer les statistiques

Exemple de retour attendu :

```json
{
  "totalLogs": 100,
  "logCountByLevel": {
    "info": 12,
    "error": 88
  },
  "logCountByService": {
    "service1": 40,
    "service2": 60
  },
  "logCountByEnvironment": {
    "development": 30,
    "production": 70
  }
}
```
