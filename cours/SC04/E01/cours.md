# SC04E01 - Logger & microservice

## Contenu de la saison

- Logs
- MongoDB
- Architecture Microservices
- Object Storage
- Pratique API ++

## Objectifs de la journée

- Log
  - Comprendre pourquoi le simple console.log n'est pas suffisant
  - Ce qui est intéressant de log (erreur / http pour les stats / debug pour trouver des erreurs en prod)
- Voir un plan d'ensemble avec des micro services

## Microservices

### Gestion des variables d'env

*Lorsque je veux rajouter une variable d'environnement à un service*

1. **docker-compose.yml** -> rajouter la variable sur le container concerné

```yml
  ...
  environment:
        ...
        LOGS_PATH: ${API_LOGS_PATH}
```



2. On crée puis récupère la valeur de cette variable depuis le **.env** correspondant au docker compose

```txt
<!-- .env -->
API_LOGS_PATH=logs
```

!! On n'oublie pas de la rajouter au *.env.example*



3. On recupère cette variable au niveau de notre code via **config.ts**

```js
export const config = {
  ...
  logs_path: process.env.LOGS_PATH || 'logs'
};
```

### Brainstorming ?

- découpage une application en petites fonctionnalités
- plusieurs petites applications (souvent des APIs + leur BDD)
- elles travaillent ensemble
- découpage par responsabilité
- indépendance/isolation : chaque service fonctionne indépendamment des autres
- maintenabilité -> petites applications = plus facile à faire évoluer + debug, on peut assigner 1 équipe par service
- scalabilité -> permet une scalabilité horizontale

## Logs

Logging = journalisation

### Objectif du logger

1. **Diagnostic et Résolution de Problèmes (Débogage)**

- **Identifier la cause racine :** Les logs d'erreurs, avec leur message et leur pile d'appels (stack trace), permettent aux développeurs de localiser précisément la ligne de code défaillante.
- **Comprendre le contexte :** Des logs bien conçus ne se contentent pas de signaler une erreur, ils fournissent un contexte précieux : l'état de l'application, les données en cours de traitement, l'identité de l'utilisateur, etc.

2. **Surveillance et Alerte en Temps Réel (Monitoring)**

- **Détection proactive des problèmes :** En analysant le flux de logs, on peut détecter des anomalies (par exemple, une augmentation soudaine du taux d'erreurs) et déclencher des alertes avant que les utilisateurs ne soient massivement impactés.
- **Surveillance des performances :** Les logs peuvent enregistrer des métriques de performance comme les temps de réponse des requêtes ou la durée des appels à la base de données. Cela aide à identifier les goulots d'étranglement et à optimiser les performances.
- **Visualisation de l'état du système :** Les logs agrégés peuvent alimenter des tableaux de bord qui offrent une vue d'ensemble de la santé de l'application.

3. **Sécurité et Conformité**

- **Détection d'activités suspectes :** Les journaux d'accès et d'authentification permettent de repérer les tentatives de connexion échouées, les accès non autorisés ou tout autre comportement suspect.
- **Piste d'audit (Audit Trail) :** Les logs créent une piste d'audit immuable de toutes les actions effectuées dans le système. C'est crucial pour savoir qui a fait quoi et quand, ce qui est souvent une exigence pour la conformité à des normes comme le RGPD, HIPAA, ou PCI DSS.
- **Analyse post-incident :** En cas d'incident de sécurité, les logs sont essentiels pour l'analyse forensique afin de comprendre comment l'attaque s'est produite, quelle a été son étendue et comment y remédier.

4. **Analyse de l'Activité et Business Intelligence**
   Au-delà des aspects techniques, les logs peuvent fournir des informations précieuses sur l'utilisation de l'application.

- **Comprendre le comportement des utilisateurs :** En analysant les logs d'événements, on peut comprendre quelles sont les fonctionnalités les plus utilisées, les parcours utilisateurs les plus courants ou les points de friction dans l'application.
- **Prise de décision :** Ces informations peuvent orienter les décisions produit et métier, par exemple en décidant de prioriser le développement d'une fonctionnalité populaire ou d'améliorer une partie de l'application peu utilisée.